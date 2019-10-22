import { app, BrowserWindow, ipcMain } from "electron"
import path from "path"
import fs, { mkdirSync, unlink, unlinkSync } from "fs"
import pg from "pg"
import { InstallConfig } from './app'
const childProcess = require('child_process')

let win: Electron.BrowserWindow | null

const createWindow = () => {
    win = new BrowserWindow({
        height: 600,
        width: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile(path.join(__dirname, "../index.html"))
    // win.webContents.openDevTools()
    win.on("closed", () => {
        win = null
    })
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
    if (win === null) createWindow()
})


function progress(e: Electron.IpcMainEvent, percent: number, message: string) {
    e.sender.send('progress', JSON.stringify({
        message,
        percent
    }))
}

const getInstallDir = (config: InstallConfig) => {
    let appPath = config.appLocation!
    if (appPath[0] === '.') {
        appPath = path.resolve(__dirname, "..", "..", appPath)
    }
    return appPath;
}

ipcMain.on('check_install_path', (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)

    try {
        let appPath = getInstallDir(config);

        if (!fs.existsSync(appPath)) {
            fs.mkdirSync(appPath)
        }

        if (!fs.existsSync(appPath)) {
            throw new Error(`Failed to create install directory at path ${appPath}!`)
        }

        const dir = fs.readdirSync(appPath)

        if (dir.length !== 0) {
            throw new Error('Install directory must be empty!')
        }

        event.sender.send('check_install_path')
    } catch (error) {
        event.sender.send('check_install_path', error.message)
    }
})

ipcMain.on('check_database_connection', async (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)
    try {
        const db = new pg.Client({
            host: config.dbHost!,
            port: parseInt(config.dbPort!),
            user: config.dbUsename!,
            password: config.dbPassword!,
            database: "postgres",
        })

        await db.connect()
        await db.query(`SELECT 1`)

        event.sender.send('check_database_connection')
    } catch (error) {
        event.sender.send('check_database_connection', `Failed to connect postgres (${error.message})`)
    }
})

async function CreateSQLUser(db: pg.Client, user: string, login: boolean = false, su: boolean = false) {
    try {
        await db.query(`CREATE ROLE ${user} WITH ${login ? '' : 'NO'}LOGIN ${su ? '' : 'NO'}SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;`)
    } catch (error) {
        if (!error.message.match("already exists")) {
            throw error
        }
    }
}

async function CreateSQLDatabase(db: pg.Client, name: string, user: string) {
    try {
        await db.query(`DROP DATABASE IF EXISTS ${name};`)
        await db.query(`
            CREATE DATABASE ${name}
                WITH 
                OWNER = ${user}
                ENCODING = 'UTF8'
                LC_COLLATE = 'ru_RU.UTF-8'
                LC_CTYPE = 'ru_RU.UTF-8'
                TEMPLATE = template0
                TABLESPACE = pg_default
                CONNECTION LIMIT = -1;
        `)
    } catch (error) {
        if (!error.message.match("already exists")) {
            throw error
        }
    }
}


function exec(command, options = {}) {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, options, (error, stdout, stderr) => {
            if (error) {
                error.stderr = stderr;
                return reject(error);
            }
            resolve({ stdout: stdout });
        });
    });
}

ipcMain.on('install', async (event, arg) => {

    const config: InstallConfig = JSON.parse(arg)
    try {
        const db = new pg.Client({
            host: config.dbHost!,
            port: parseInt(config.dbPort!),
            user: config.dbUsename!,
            password: config.dbPassword!,
            database: "postgres",
        })

        progress(event, 1, 'Connecting postgres...')
        await db.connect()
        progress(event, 3, 'Creating roles...')

        await CreateSQLUser(db, 's_su', true, true)
        await CreateSQLUser(db, 's_mc', true)
        await CreateSQLUser(db, 's_mp')
        await CreateSQLUser(db, 's_ac', true)
        await CreateSQLUser(db, 's_ap')

        await db.query(`ALTER USER s_su WITH PASSWORD 's_su';`)
        await db.query(`ALTER USER s_mc WITH PASSWORD 's_mc';`)
        await db.query(`ALTER USER s_ac WITH PASSWORD 's_ac';`)
        
        progress(event, 6, 'Settings search paths...')

        await db.query(`ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;`)
        await db.query(`ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;`)       
                
        progress(event, 9, 'Creating core database...')

        await CreateSQLDatabase(db, 'core', 's_su')

        progress(event, 12, 'Creating core_auth database...')

        await CreateSQLDatabase(db, 'core_auth', 's_su')

        progress(event, 15, 'Migrating core...')

        await exec(
            path.resolve(__dirname, '..', '..', 'core-backend', 'dbms', 'update' + (process.platform === 'win32' ? '.bat' : ''))
        )

        progress(event, 20, 'Migrating core_auth...')

        await exec(
            path.resolve(__dirname, '..', '..', 'core-backend', 'dbms_auth', 'update' + (process.platform === 'win32' ? '.bat' : ''))
        )

        await exec('rm -R ' + path.resolve(__dirname, '..', '..', 'core-frontend'))
        await exec('rm -R ' + path.resolve(__dirname, '..', '..', 'core-backend'))

        progress(event, 24, 'Fetching core-frontend...')

        await exec('git clone https://github.com/essence-community/core-frontend.git')

        progress(event, 26, 'Fetching core-backend...')

        await exec('git clone https://github.com/essence-community/core-backend.git')


        progress(event, 28, 'Installing backend dependencies...')

        await exec('yarn yarn:backend:install')

        progress(event, 30, 'Building plugins...')
        await exec('yarn yarn:backend:build:plugins')
        progress(event, 32, 'Building contexts...')
        await exec('yarn yarn:backend:build:contexts')
        progress(event, 34, 'Building events...')
        await exec('yarn yarn:backend:build:events')
        progress(event, 36, 'Building schedulers...')
        await exec('yarn yarn:backend:build:schedulers')
        progress(event, 38, 'Building providers...')
        await exec('yarn yarn:backend:build:providers')
        progress(event, 40, 'Building server...')
        await exec('yarn yarn:backend:build:server')
        progress(event, 42, 'Building plugininf...')
        await exec('yarn yarn:backend:build:plugininf')
        progress(event, 44, 'Building libs...')
        await exec('yarn yarn:backend:build:libs')
        progress(event, 46, 'Copyring certs...')
        await exec('yarn yarn:backend:build:cert')
        progress(event, 48, 'Copyring package...')
        await exec('yarn yarn:backend:build:copy')

        progress(event, 50, 'Installing frontend dependencies...')

        await exec('yarn yarn:frontend:install')

        progress(event, 55, 'Building frontend package...')

        await exec('yarn yarn:frontend:build')

        progress(event, 75, 'Creating catalogs...')

        const installDir = getInstallDir(config)

        mkdirSync(path.resolve(installDir, 'config'))
        mkdirSync(path.resolve(installDir, 'logs'))
        mkdirSync(path.resolve(installDir, 'tmp'))
        mkdirSync(path.resolve(installDir, 'public'))

        progress(event, 80, 'Creating configs...')
        
        const configFiles = [
            'logger.json', 
            't_context.toml', 
            't_events.toml', 
            't_plugins.toml', 
            't_providers.toml', 
            't_query.toml', 
            't_schedulers.toml', 
            't_servers.toml'
        ]
        
        const configReplaces = [
            ['#INSTALL_PATH#', installDir],
            ['#DB_HOST#', config.dbHost],
            ['#DB_PORT#', config.dbPort],
            ['#SERVER_HOST#', config.serverHost],
            ['#SERVER_IP#', config.serverIp],
        ]

        for (const fileName of configFiles) {
            let fileContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'config', fileName), { encoding: 'utf-8'})
            configReplaces.map(replace => {
                fileContent = fileContent.replace(new RegExp(replace[0]!, 'g'), replace[1]!)
            })
            fs.writeFileSync(path.resolve(installDir, 'config', fileName), fileContent, { encoding: "utf-8"})
        }

        progress(event, 84, 'Moving backend...')

        await exec(`cp -R ${path.resolve(__dirname, '..', '..', 'core-backend', 'bin')}/* ${installDir}`)

        progress(event, 86, 'Moving frontend...')

        await exec(`cp -R ${path.resolve(__dirname, '..', '..', 'core-frontend', 'build')}/* ${installDir}/public`)

        progress(event, 90, 'Installing server dependencies...')

        progress(event, 95, 'Patching package...')
        
        const packageJson: any = JSON.parse(
            fs.readFileSync(path.resolve(installDir, 'package.json'), { encoding: 'utf-8' })
        )

        packageJson.nodemonConfig.env = {
            ...packageJson.nodemonConfig.env,
            LOGGER_CONF: `${installDir}/logger.json`,
            PROPERTY_DIR: `${installDir}/config`,
            GATE_UPLOAD_DIR: `${installDir}/tmp`,
            NEDB_TEMP_DB: `${installDir}/tmp/db`,    
        }
        fs.writeFileSync(path.resolve(installDir, 'package.json'), JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' })

        progress(event, 98, 'Finishing...')

        setTimeout(() => progress(event, 100, ''))

    } catch (error) {
        event.sender.send('install_error', 'FATAL ERROR: ' + error.message)
    }
})
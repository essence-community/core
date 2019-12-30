import { app, BrowserWindow, ipcMain } from "electron"
import fs from "fs"
import path from "path"
import pg from "pg"
import rimraf from 'rimraf'
import { InstallConfig } from './app'
const childProcess = require('child_process')

let win: Electron.BrowserWindow | null
const isWin32 = process.platform === 'win32'
let installDir: string;

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


function ProcessSender(e: Electron.IpcMainEvent) {
    return (percent: number, message: string) => {
        e.sender.send('progress', JSON.stringify({
            message,
            percent
        }))
    }
}

function checkJavaVersion() {
    return new Promise((resolve, reject) => {
        const spawn = childProcess.spawn('java', ['-version'])
        spawn.on('error', (error: Error) => reject(error))
        spawn.stderr.on('data', (data: string) => {
            data = data.toString().split('\n')[0];
            var checkJavaVersion = new RegExp('version').test(data) ? data.split(' ')[2].replace(/"/g, '') : false;
            if (checkJavaVersion != false) {
                return resolve(checkJavaVersion)
            } else {
                reject(new Error('Java not installed'))
            }
        })
    })
}


const getInstallDir = (config: InstallConfig) => {
    let appPath = config.appLocation!
    if (appPath[0] === '.') {
        appPath = path.resolve(__dirname, "..", "..", appPath)
    }
    return appPath;
}

async function CreateSQLUser(db: pg.Client, user: string, login: boolean = false, su: boolean = false) {
    try {
        await db.query(`CREATE ROLE ${user} WITH ${login ? '' : 'NO'}LOGIN ${su ? '' : 'NO'}SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;`)
    } catch (error) {
        if (error.code != 42710) {
            throw error
        } else {
            console.warn(error.message)
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
        if (error.code != 42710) {
            throw error
        } else {
            console.warn(error.message)
        }
    }
}

function exec(command: string, options = {}) {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, options, (error, stdout, stderr) => {
            if (error) {
                error.stderr = stderr;
                return reject(error)
            }
            resolve({ stdout: stdout })
        })
    })
}

ipcMain.on('check', async (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)
    
    try {
        let appPath = getInstallDir(config)

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

        await checkJavaVersion()

        event.sender.send('check')
    } catch (error) {
        event.sender.send('check', error.message)
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

        const progress = ProcessSender(event)

        progress(1, 'Connecting postgres...')
        await db.connect()

        progress(3, 'Creating roles...')

        await CreateSQLUser(db, 's_su', true, true)
        await CreateSQLUser(db, 's_mc', true)
        await CreateSQLUser(db, 's_mp')
        await CreateSQLUser(db, 's_ac', true)
        await CreateSQLUser(db, 's_ap')

        for (const user of ["s_su", "s_mc", "s_ac"]) {
            await db.query(`ALTER USER ${user} WITH PASSWORD '${user}';`)
        }
        
        progress(6, 'Settings search paths...')

        await db.query(`ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;`)
        await db.query(`ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;`)       
                
        progress(9, 'Creating core database...')
        await CreateSQLDatabase(db, config.dbPrefix + 'meta', 's_su')

        progress(12, 'Creating meta database...')
        await CreateSQLDatabase(db, config.dbPrefix + 'auth', 's_su')
        
        progress(13, 'Clearing source directories...')
        for (let dir of ["core-frontend", "core-backend"]) {
            dir = path.resolve(__dirname, '..', '..', dir)
            if (fs.existsSync(dir)) {
                if (isWin32) {
                    rimraf.sync(dir)
                } else {
                    await exec(`rm -Rf ${dir}`)
                }
            }
        }

        progress(15, 'Fetching core-frontend...')
        await exec('yarn frontend:clone')

        progress(18, 'Fetching core-backend...')
        await exec('yarn backend:clone')

        const liquibaseParams = '--username=s_su --password=s_su --driver=org.postgresql.Driver update'
        const backendPath = path.resolve(__dirname, '..', '..', 'core-backend')
        const dbmsPath = path.resolve(backendPath, 'dbms')
        const dbmsAuthPath = path.resolve(backendPath, 'dbms_auth')
        const liquibase = path.resolve(dbmsPath, 'liquibase', 'liquibase')

        progress(20, `Migrating core...`)
        await exec(`cd ${dbmsPath} && ${isWin32 ? 'call ' : ''}${liquibase}${isWin32 ? '.bat' : ''} --changeLogFile=${path.resolve(dbmsPath, 'db.changelog.xml')} --url=jdbc:postgresql://${config.dbHost}:${config.dbPort}/${config.dbPrefix}meta ${liquibaseParams}`)
        
        progress(22, `Migrating meta...`)
        await exec(`cd ${dbmsAuthPath} && ${isWin32 ? 'call ' : ''}${liquibase}${isWin32 ? '.bat' : ''} --changeLogFile=${path.resolve(dbmsAuthPath, 'db.changelog.meta.xml')} --url=jdbc:postgresql://${config.dbHost}:${config.dbPort}/${config.dbPrefix}meta ${liquibaseParams}`)
        
        progress(25, `Migrating auth...`)
        await exec(`cd ${dbmsAuthPath} && ${isWin32 ? 'call ' : ''}${liquibase}${isWin32 ? '.bat' : ''} --changeLogFile=${path.resolve(dbmsAuthPath, 'db.changelog.auth.xml')} --url=jdbc:postgresql://${config.dbHost}:${config.dbPort}/${config.dbPrefix}auth ${liquibaseParams}`)

        progress(28, 'Installing backend dependencies...')
        await exec('yarn backend:install')

        progress(32, 'Building backend...')
        await exec(`yarn backend:build`)

        progress(50, 'Installing frontend dependencies...')
        await exec('yarn frontend:install')

        progress(55, 'Building frontend package...')
        await exec('yarn frontend:build')

        progress(75, 'Creating catalogs...')

        installDir = getInstallDir(config)

        for (const dir of ["config", "logs", "tmp", "public"]) {
            fs.mkdirSync(path.resolve(installDir, dir))
        }

        progress(80, 'Creating configs...')
        
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
            ['#MAIN_LOGS_PATH#', path.resolve(installDir, 'logs', 'main.json')],
            ['#ERROR_LOGS_PATH#', path.resolve(installDir, 'logs', 'error.log')],
            ['#DB_HOST#', config.dbHost],
            ['#DB_PORT#', config.dbPort],
            ['#SERVER_HOST#', config.serverHost],
            ['#SERVER_IP#', config.serverIp],
            ['#DB_PREFIX#', config.dbPrefix]
        ]

        for (const fileName of configFiles) {
            let fileContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'config', fileName), { encoding: 'utf-8'})
            configReplaces.map(replace => {
                fileContent = fileContent.replace(new RegExp(replace[0]!, 'g'), replace[1]!)
                if (isWin32) {
                    fileContent = fileContent.replace(/\\/g, "\\\\")
                }
            })
            fs.writeFileSync(path.resolve(installDir, 'config', fileName), fileContent, { encoding: "utf-8"})
        }

        progress(84, 'Moving backend...')
        await exec(`cp -R ${path.resolve(backendPath, 'bin')}/* ${installDir}`)

        progress(86, 'Moving frontend...')
        await exec(`cp -R ${path.resolve(__dirname, '..', '..', 'core-frontend', 'build')}/* ${installDir}/public`)

        progress(90, 'Installing server dependencies...')
        await exec(`cd ${installDir} && yarn install`)

        progress(95, 'Patching package...')
        
        const packageJson: any = JSON.parse(
            fs.readFileSync(path.resolve(installDir, 'package.json'), { encoding: 'utf-8' })
        )

        packageJson.nodemonConfig.env = {
            ...packageJson.nodemonConfig.env,
            LOGGER_CONF: path.resolve(installDir, 'config', 'logger.json'),
            PROPERTY_DIR: path.resolve(installDir, 'config'),
            GATE_UPLOAD_DIR: path.resolve(installDir, 'tmp'),
            NEDB_TEMP_DB: path.resolve(installDir, 'tmp', 'db'),    
        }

        fs.writeFileSync(path.resolve(installDir, 'package.json'), JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' })

        progress(98, 'Finishing...')

        setTimeout(() => progress(100, ''))

    } catch (error) {
        console.error(error)
        event.sender.send('install_error', 'FATAL ERROR: ' + error.message)
    }
})

ipcMain.on('close', async (event, arg) => {
    app.quit()
})

ipcMain.on('open_installation_dir', async (event, arg) => {
    exec(`${isWin32 ? 'start' : 'open'} ${installDir}`)
})
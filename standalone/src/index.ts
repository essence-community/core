import { app, BrowserWindow, ipcMain } from "electron"
import * as fs from "fs"
import * as path from "path"
import pg from "pg"
import * as URL from "url"
import * as os from "os"
import * as CopyDir from "copy-dir"
import AdmZip from "adm-zip"
import * as childProcess from "child_process"
import { InstallConfig } from "./Config.types"

let win: Electron.BrowserWindow | null
const isWin32 = process.platform === "win32"
let installDir: string
let wwwDir: string
const NAME_DIR_DBMS_AUTH = "dbms_auth"

const createWindow = () => {
    win = new BrowserWindow({
        height: 600,
        width: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    win.loadFile(path.join(__dirname, "app/index.html"))
    win.webContents.openDevTools()
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

const zipFile = {
    ungate: "",
    core: "",
    dbms: "",
    [NAME_DIR_DBMS_AUTH]: "",
}

function ProcessSender(e: Electron.IpcMainEvent) {
    return (percent: number, message: string) => {
        e.sender.send(
            "progress",
            JSON.stringify({
                message,
                percent,
            }),
        )
    }
}

function checkJavaVersion() {
    return new Promise((resolve, reject) => {
        const spawn = childProcess.spawn("java", ["-version"])
        spawn.on("error", (error: Error) => reject(error))
        spawn.stderr.on("data", (data: string) => {
            data = data.toString().split("\n")[0]
            const checkJavaVersion = new RegExp("version").test(data) ? data.split(" ")[2].replace(/"/g, "") : false
            if (checkJavaVersion != false) {
                return resolve(checkJavaVersion)
            } else {
                reject(new Error("Java not installed"))
            }
        })
    })
}

function checkZip() {
    const files = fs.readdirSync(__dirname)
    const res = files.reduce(
        (obj, file) => {
            if (file.startsWith("ungate") && file.endsWith(".zip")) {
                obj.ungate = true
                zipFile.ungate = path.join(__dirname, file)
            }
            if (file.startsWith("core") && file.endsWith(".zip")) {
                obj.core = true
                zipFile.core = path.join(__dirname, file)
            }
            if (file.startsWith("dbms_auth") && file.endsWith(".zip")) {
                obj[NAME_DIR_DBMS_AUTH] = true
                zipFile[NAME_DIR_DBMS_AUTH] = path.join(__dirname, file)
            } else if (file.startsWith("dbms") && file.endsWith(".zip")) {
                obj.dbms = true
                zipFile.dbms = path.join(__dirname, file)
            }
            return obj
        },
        {
            ungate: false,
            core: false,
            [NAME_DIR_DBMS_AUTH]: false,
            dbms: false,
        },
    )
    if (!res.core) {
        throw new Error("Not found core_*.zip")
    }
    if (!res.ungate) {
        throw new Error("Not found ungate_*.zip")
    }
    if (!res.dbms) {
        throw new Error("Not found dbms_*.zip")
    }
    if (!res.dbms_auth) {
        throw new Error("Not found dbms_auth_*.zip")
    }
}

function unZipFile(tempDir: string) {
    for (const dir of Object.keys(zipFile)) {
        const fDir = path.join(tempDir, dir)
        fs.mkdirSync(fDir, {
            recursive: true,
        })
        const ziped = new AdmZip(zipFile[dir])
        ziped.extractAllTo(fDir, true)
    }
}

const getInstallDir = (appPath: string) => {
    if (appPath[0] === ".") {
        appPath = path.resolve(__dirname, appPath)
    }
    return appPath
}

async function CreateSQLUser(db: pg.Client, user: string, login = false, su = false) {
    try {
        await db.query(
            `CREATE ROLE ${user} WITH ${login ? "" : "NO"}LOGIN ${
                su ? "" : "NO"
            }SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;`,
        )
    } catch (error) {
        if (error.code != 42710) {
            throw error
        } else {
            console.warn(error.message)
        }
    }
}

async function checkSQLDatabase(db: pg.Client, name: string) {
    try {
        const res = await db.query(
            "select\n" + "    datname\n" + "from\n" + "    pg_database\n" + "where\n" + `    datname = '${name}'\n`,
        )
        return res.rows.length === 0
    } catch (error) {
        if (error.code != 42710) {
            throw error
        } else {
            console.warn(error.message)
        }
    }
    return false
}

async function checkSQLUser(db: pg.Client, name: string) {
    try {
        const res = await db.query(
            "select\n" + "    rolname\n" + "from\n" + "    pg_roles\n" + "where\n" + `    rolname = '${name}'\n`,
        )
        return res.rows.length === 0
    } catch (error) {
        if (error.code != 42710) {
            throw error
        } else {
            console.warn(error.message)
        }
    }
    return false
}

async function CreateSQLDatabase(db: pg.Client, name: string, user: string) {
    try {
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
        childProcess.exec(command, options, (error: any, stdout, stderr) => {
            if (error) {
                error.stderr = stderr
                return reject(error)
            }
            resolve({ stdout: stdout })
        })
    })
}

ipcMain.on("check", async (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)

    try {
        const appPath = getInstallDir(config.appLocation!)

        if (!fs.existsSync(appPath)) {
            fs.mkdirSync(appPath, {
                recursive: true,
            })
        }

        if (!fs.existsSync(appPath)) {
            throw new Error(`Failed to create install directory at path ${appPath}!`)
        }
        const wwwPath = getInstallDir(config.wwwLocation!)

        if (!fs.existsSync(wwwPath)) {
            fs.mkdirSync(wwwPath, {
                recursive: true,
            })
        }

        if (!fs.existsSync(wwwPath)) {
            throw new Error(`Failed to create install directory at path ${wwwPath}!`)
        }

        if (config.isUpdate) {
            const dir = fs.readdirSync(appPath)

            if (dir.length !== 0) {
                throw new Error("Install directory must be empty!")
            }
        }

        checkZip()

        await checkJavaVersion()

        event.sender.send("check")
    } catch (error) {
        event.sender.send("check", error.message)
    }
})

ipcMain.on("check_config_install", async (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)
    try {
        if (fs.existsSync(path.join(os.homedir(), ".core_install_conf.json"))) {
            event.sender.send(
                "check_config_install",
                fs.readFileSync(path.join(os.homedir(), ".core_install_conf.json"), { encoding: "utf-8" }),
            )
        }
        const insDir = getInstallDir(config.appLocation!)
        if (fs.existsSync(path.join(insDir, ".core_install_conf.json"))) {
            event.sender.send(
                "check_config_install",
                fs.readFileSync(path.join(insDir, ".core_install_conf.json"), { encoding: "utf-8" }),
            )
        }
    } catch (error) {}
})

ipcMain.on("check_database_connection", async (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)
    try {
        const db = new pg.Client({
            connectionString: config.dbConnectString!,
            user: config.dbUsername!,
            password: config.dbPassword!,
        })

        await db.connect()
        await db.query(`SELECT 1`)

        event.sender.send("check_database_connection")
    } catch (error) {
        event.sender.send("check_database_connection", `Failed to connect postgres (${error.message})`)
    }
})

function copyFiles(from: string, to: string) {
    return new Promise((resolve, reject) => {
        CopyDir(from, to, err => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

function deleteFolderRecursive(pathDir: string) {
    if (fs.existsSync(pathDir)) {
        if (fs.lstatSync(pathDir).isDirectory()) {
            fs.readdirSync(pathDir).forEach(file => {
                const curPath = path.join(pathDir, file)
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath)
                } else {
                    // delete file
                    fs.unlinkSync(curPath)
                }
            })
            fs.rmdirSync(pathDir)
            return
        }
        fs.unlinkSync(pathDir)
    }
}
ipcMain.on("install", async (event, arg) => {
    const config: InstallConfig = JSON.parse(arg)

    try {
        const conn = URL.parse(config.dbConnectString!)
        const db = new pg.Client({
            host: conn.host!,
            port: parseInt(conn.port!, 10),
            user: config.dbUsername!,
            password: config.dbPassword!,
        })

        const progress = ProcessSender(event)

        progress(1, "Connecting postgres...")
        await db.connect()

        if (!config.isUpdate) {
            progress(3, "Creating roles...")

            if (await checkSQLUser(db, "s_su")) {
                await CreateSQLUser(db, "s_su", true, true)
                await db.query(`ALTER USER s_su WITH PASSWORD 's_su';`)
            }
            if (await checkSQLUser(db, "s_mc")) {
                await CreateSQLUser(db, "s_mc", true)
                await db.query(`ALTER USER s_mc WITH PASSWORD 's_mc';`)
                await db.query(`ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;`)
            }
            if (await checkSQLUser(db, "s_mp")) {
                await CreateSQLUser(db, "s_mp")
            }
            if (await checkSQLUser(db, "s_ac")) {
                await CreateSQLUser(db, "s_ac", true)
                await db.query(`ALTER USER s_ac WITH PASSWORD 's_ac';`)
                await db.query(`ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;`)
            }
            if (await checkSQLUser(db, "s_ap")) {
                await CreateSQLUser(db, "s_ap")
            }

            if (await checkSQLDatabase(db, config.dbPrefix + "meta")) {
                progress(9, "Creating core database...")
                await CreateSQLDatabase(db, config.dbPrefix + "meta", "s_su")
            }
            if (await checkSQLDatabase(db, config.dbPrefix + "auth")) {
                progress(12, "Creating meta database...")
                await CreateSQLDatabase(db, config.dbPrefix + "auth", "s_su")
            }
        }

        const tempDir = fs.mkdtempSync("install_core_temp")
        progress(20, `Unzip...`)
        unZipFile(tempDir)
        const liquibaseParams = `--username=${config.isUpdate ? config.dbUsername : "s_su"} --password=${
            config.isUpdate ? config.dbPassword : "s_su"
        } --driver=org.postgresql.Driver update`
        const dbmsPath = path.join(tempDir, "dbms")
        const dbmsAuthPath = path.join(tempDir, "dbms_auth")
        const liquibase = path.join(dbmsPath, "liquibase", "liquibase")

        progress(30, `Migrating core...`)
        await exec(
            `cd ${dbmsPath} && ${isWin32 ? "call " : ""}${liquibase}${
                isWin32 ? ".bat" : ""
            } --changeLogFile=${path.resolve(dbmsPath, "db.changelog.xml")} --url=jdbc:postgresql://${conn.host}:${
                conn.port
            }/${config.dbPrefix}meta ${liquibaseParams}`,
        )

        progress(50, `Migrating meta...`)
        await exec(
            `cd ${dbmsAuthPath} && ${isWin32 ? "call " : ""}${liquibase}${
                isWin32 ? ".bat" : ""
            } --changeLogFile=${path.resolve(dbmsAuthPath, "db.changelog.meta.xml")} --url=jdbc:postgresql://${
                conn.host
            }:${conn.port}/${config.dbPrefix}meta ${liquibaseParams}`,
        )

        progress(55, `Migrating auth...`)
        await exec(
            `cd ${dbmsAuthPath} && ${isWin32 ? "call " : ""}${liquibase}${
                isWin32 ? ".bat" : ""
            } --changeLogFile=${path.resolve(dbmsAuthPath, "db.changelog.auth.xml")} --url=jdbc:postgresql://${
                conn.host
            }:${conn.port}/${config.dbPrefix}auth ${liquibaseParams}`,
        )

        installDir = getInstallDir(config.appLocation!)
        wwwDir = getInstallDir(config.wwwLocation!)
        if (config.isUpdate) {
            progress(85, "Copy files...")
            deleteFolderRecursive(path.join(installDir, "ungate"))
            deleteFolderRecursive(wwwDir)
            fs.mkdirSync(wwwDir, {
                recursive: true,
            })
            fs.mkdirSync(path.join(installDir, "ungate"), {
                recursive: true,
            })
            await copyFiles(path.join(tempDir, "ungate"), path.join(installDir, "ungate"))
            await copyFiles(path.join(tempDir, "core"), wwwDir)
        } else {
            progress(75, "Creating catalogs...")
            for (const dir of ["config", "logs", "tmp", "ungate"]) {
                fs.mkdirSync(path.resolve(installDir, dir), {
                    recursive: true,
                })
            }
            fs.mkdirSync(wwwDir, {
                recursive: true,
            })
            progress(80, "Creating configs...")

            const configFiles = [
                "logger.json",
                "t_context.toml",
                "t_events.toml",
                "t_plugins.toml",
                "t_providers.toml",
                "t_query.toml",
                "t_schedulers.toml",
                "t_servers.toml",
            ]

            const configReplaces = [
                ["#MAIN_LOGS_PATH#", path.join(installDir, "logs", "main.json")],
                ["#ERROR_LOGS_PATH#", path.join(installDir, "logs", "error.log")],
                ["#DB_HOST#", `${conn.host || "127.0.0.1"}`],
                ["#DB_PORT#", `${conn.port || "5432"}`],
                ["#SERVER_HOST#", os.hostname],
                ["#SERVER_IP#", "127.0.0.1"],
                ["#DB_PREFIX#", config.dbPrefix],
            ]

            for (const fileName of configFiles) {
                let fileContent = fs.readFileSync(path.join(tempDir, "config", fileName), { encoding: "utf-8" })
                configReplaces.map((replace: any) => {
                    fileContent = fileContent.replace(new RegExp(replace[0]!, "g"), replace[1]!)
                    if (isWin32) {
                        fileContent = fileContent.replace(/\\/g, "\\\\")
                    }
                })
                fs.writeFileSync(path.join(installDir, "config", fileName), fileContent, { encoding: "utf-8" })
            }

            progress(85, "Copy files...")
            await copyFiles(path.join(tempDir, "ungate"), path.join(installDir, "ungate"))
            await copyFiles(path.join(tempDir, "core"), wwwDir)
            progress(95, "Patching package...")

            const packageJson: any = JSON.parse(
                fs.readFileSync(path.join(installDir, "ungate", "package.json"), { encoding: "utf-8" }),
            )

            packageJson.nodemonConfig.env = {
                ...packageJson.nodemonConfig.env,
                LOGGER_CONF: path.join(installDir, "config", "logger.json"),
                PROPERTY_DIR: path.join(installDir, "config"),
                GATE_UPLOAD_DIR: path.join(installDir, "tmp"),
                NEDB_TEMP_DB: path.join(installDir, "tmp", "db"),
            }

            fs.writeFileSync(path.join(installDir, "ungate", "package.json"), JSON.stringify(packageJson, null, 2), {
                encoding: "utf-8",
            })
            config.isUpdate = true
            fs.writeFileSync(path.join(installDir, ".core_install_conf.json"), JSON.stringify(config, null, 2), {
                encoding: "utf-8",
            })
            fs.writeFileSync(path.join(os.homedir(), ".core_install_conf.json"), JSON.stringify(config, null, 2), {
                encoding: "utf-8",
            })
        }

        progress(98, "Finishing...")

        setTimeout(() => progress(100, ""))
    } catch (error) {
        console.error(error)
        event.sender.send("install_error", "FATAL ERROR: " + error.message)
    }
})

ipcMain.on("close", async (event, arg) => {
    app.quit()
})

ipcMain.on("open_installation_dir", async (event, arg) => {
    exec(`${isWin32 ? "start" : "open"} ${installDir}`)
})

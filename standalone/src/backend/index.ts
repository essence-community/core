import * as fs from "fs";
import * as path from "path";
import * as URL from "url";
import * as os from "os";
import pg from "pg";
import CopyDir from "copy-dir";
import * as cliProgress from "cli-progress";
import fixPath from "fix-path";
import {dialog, app, BrowserWindow, ipcMain} from "electron";
import {IInstallConfig} from "./Config.types";
import {
    isEmpty,
    deleteFolderRecursive,
    getInstallDir,
    checkNodeJsVersion,
    checkJavaVersion,
    unZipFile,
    exec,
    ProcessSender,
} from "./util/base";
import {readConfig} from "./NoGui";

// Fixed env PATH
fixPath();

let win: Electron.BrowserWindow | null;
const isWin32 = process.platform === "win32";
let installDir: string;
let wwwDir: string;
const NAME_DIR_DBMS_AUTH = "dbms_auth";

const isNotGui = process.argv.includes("--nogui");

const createWindow = () => {
    win = new BrowserWindow({
        height: 768,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
        },
        width: 1024,
    });
    win.loadFile(path.join(__dirname, "app/index.html"));
    win.setMenuBarVisibility(false);
    if (process.env.DEBUG_INSTALL === "true") {
        win.webContents.openDevTools();
    }
    win.on("closed", () => {
        win = null;
    });
};

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

const zipFile = {
    [NAME_DIR_DBMS_AUTH]: "",
    core: "",
    dbms: "",
    ungate: "",
};

function checkZip() {
    const files = fs.readdirSync(__dirname);
    const res = files.reduce(
        (obj, file) => {
            if (file.startsWith("ungate") && file.endsWith(".zip")) {
                obj.ungate = true;
                zipFile.ungate = path.join(__dirname, file);
            }
            if (file.startsWith("core") && file.endsWith(".zip")) {
                obj.core = true;
                zipFile.core = path.join(__dirname, file);
            }
            if (file.startsWith("dbms_auth") && file.endsWith(".zip")) {
                obj[NAME_DIR_DBMS_AUTH] = true;
                zipFile[NAME_DIR_DBMS_AUTH] = path.join(__dirname, file);
            }
            if (file.startsWith("dbms_core") && file.endsWith(".zip")) {
                obj.dbms = true;
                zipFile.dbms = path.join(__dirname, file);
            }

            return obj;
        },
        {
            [NAME_DIR_DBMS_AUTH]: false,
            core: false,
            dbms: false,
            ungate: false,
        },
    );

    if (!res.core) {
        throw new Error("Not found core_*.zip");
    }
    if (!res.ungate) {
        throw new Error("Not found ungate_*.zip");
    }
    if (!res.dbms) {
        throw new Error("Not found dbms_*.zip");
    }
    if (!res[NAME_DIR_DBMS_AUTH]) {
        throw new Error("Not found dbms_auth_*.zip");
    }
}

async function CreateSQLUser(db: pg.Client, user: string, login = false, su = false) {
    try {
        await db.query(
            `CREATE ROLE ${user} WITH ${login ? "" : "NO"}LOGIN ${
                su ? "" : "NO"
            }SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;`,
        );
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }
}

async function checkSQLDatabase(db: pg.Client, name: string) {
    try {
        const res = await db.query(
            "select\n" + "    datname\n" + "from\n" + "    pg_database\n" + "where\n" + `    datname = '${name}'\n`,
        );

        return res.rows.length === 0;
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }

    return false;
}

async function checkSQLUser(db: pg.Client, name: string) {
    try {
        const res = await db.query(
            "select\n" + "    rolname\n" + "from\n" + "    pg_roles\n" + "where\n" + `    rolname = '${name}'\n`,
        );

        return res.rows.length === 0;
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }

    return false;
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
        `);
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }
}

async function checkVersionUpdateSQLDatabase(config: IInstallConfig) {
    try {
        const conn = URL.parse(config.dbConnectString!);
        const db = new pg.Client({
            database: `${config.dbPrefixMeta}meta`,
            host: conn.hostname!,
            password: config.dbPassword!,
            port: parseInt(conn.port!, 10),
            user: config.dbUsername!,
        });

        await db.connect();
        const versionApp = fs.readFileSync(path.resolve(__dirname, "VERSION")).toString();
        const {rows} = await db.query("SELECT cv_value from s_mt.t_sys_setting where ck_id = 'core_db_major_version'");

        await new Promise((resolve, reject) => {
            const [{cv_value: cvValue}] = rows;

            if (!isEmpty(cvValue)) {
                const [MajorNew, MinorNew, PatchNew] = versionApp.split(".").map((val) => parseInt(val, 10));
                const [MajorOld, MinorOld, PatchOld] = cvValue.split(".").map((val) => parseInt(val, 10));

                if (
                    MajorNew < MajorOld ||
                    (MajorNew === MajorOld && MinorNew < MinorOld) ||
                    (MajorNew === MajorOld && MinorNew === MinorOld && PatchNew < PatchOld)
                ) {
                    reject(new Error("Installed app is younger"));
                }
            }
            resolve();
        });
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }
}

async function checkVersionSQLDatabase(config: IInstallConfig) {
    try {
        const conn = URL.parse(config.dbConnectString!);
        const db = new pg.Client({
            database: conn.pathname!.substr(1),
            host: conn.hostname!,
            password: config.dbPassword!,
            port: parseInt(conn.port!, 10),
            user: config.dbUsername!,
        });

        await db.connect();
        const {rows} = await db.query("SELECT version()");

        await new Promise((resolve, reject) => {
            const [{version}] = rows;

            version.replace(/^[A-z]+\s+(\d+)/, (match, pattern) => {
                if (parseFloat(pattern) < 11) {
                    reject(new Error("Need version PostgreSql 11+"));
                }

                return "";
            });
            resolve();
        });
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }
}

async function checkLib(config: IInstallConfig) {
        const conn = URL.parse(config.dbConnectString!);
        const db = new pg.Client({
            database: conn.pathname!.substr(1),
            host: conn.hostname!,
            password: config.dbPassword!,
            port: parseInt(conn.port!, 10),
            user: config.dbUsername!,
        });

        await db.connect();
        const {rows} = await db.query("select * from pg_available_extensions where name in ('uuid-ossp', 'pgcrypto')");

        if (rows.filter((row) => row.name === 'uuid-ossp').length === 0) {
            throw new Error("Could not open extension uuid-ossp. Need install contrib for postgres")
        }

        if (rows.filter((row) => row.name === 'pgcrypto').length === 0) {
            throw new Error("Could not open extension pgcrypto. Need install contrib for postgres")
        }
}

// eslint-disable-next-line max-statements
ipcMain.on("check", async (event, arg) => {
    const {config, step} = JSON.parse(arg);

    try {
        if (step === 1) {
            const appPath = getInstallDir(config.appLocation!);

            if (!fs.existsSync(appPath)) {
                fs.mkdirSync(appPath, {
                    recursive: true,
                });
            }

            if (!fs.existsSync(appPath)) {
                throw new Error(`Failed to create install directory at path ${appPath}!`);
            }
            const wwwPath = getInstallDir(config.wwwLocation!);

            if (!fs.existsSync(wwwPath)) {
                fs.mkdirSync(wwwPath, {
                    recursive: true,
                });
            }

            if (!fs.existsSync(wwwPath)) {
                throw new Error(`Failed to create install directory at path ${wwwPath}!`);
            }

            if (!config.isUpdate) {
                const dirsBackend = fs.readdirSync(appPath);

                if (dirsBackend.length !== 0) {
                    throw new Error(`${appPath} must be empty!`);
                }
                const dirsFrontend = fs.readdirSync(wwwPath);

                if (dirsFrontend.length !== 0) {
                    throw new Error(`${wwwPath} must be empty!`);
                }
            }
        }
        checkZip();
        await checkNodeJsVersion();
        await checkJavaVersion();
        if (step > 2 && !config.isUpdate) {
            await checkLib(config);
        }
        if (step > 2 && config.isUpdate) {
            await checkVersionUpdateSQLDatabase(config);
        }
        event.sender.send("check");
    } catch (error) {
        event.sender.send("check", error.message);
    }
});

ipcMain.on("check_config_install", async (event, arg) => {
    try {
        if (!arg && fs.existsSync(path.join(os.homedir(), ".core_install_conf.json"))) {
            event.sender.send(
                "check_config_install",
                fs.readFileSync(path.join(os.homedir(), ".core_install_conf.json"), {encoding: "utf-8"}),
            );

            return;
        }
        if (arg) {
            const config: IInstallConfig = JSON.parse(arg);
            const insDir = getInstallDir(config.appLocation!);

            if (fs.existsSync(path.join(insDir, ".core_install_conf.json"))) {
                event.sender.send(
                    "check_config_install",
                    fs.readFileSync(path.join(insDir, ".core_install_conf.json"), {encoding: "utf-8"}),
                );
            }
        }
    } catch (error) {}
});

ipcMain.on("check_database_connection", async (event, arg) => {
    const config: IInstallConfig = JSON.parse(arg);

    try {
        await checkVersionSQLDatabase(config);
        event.sender.send("check_database_connection");
    } catch (error) {
        event.sender.send("check_database_connection", `Failed to connect postgres (${error.message})`);
    }
});

function copyFiles(from: string, to: string) {
    return new Promise((resolve, reject) => {
        CopyDir(from, to, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

// eslint-disable-next-line max-lines-per-function,max-statements
const install = async (config: IInstallConfig, progress: (number, string) => void) => {
    const conn = URL.parse(config.dbConnectString!);
    const db = new pg.Client({
        database: conn.pathname!.substr(1),
        host: conn.hostname!,
        password: config.dbPassword!,
        port: parseInt(conn.port!, 10),
        user: config.dbUsername!,
    });

    progress(1, "Connecting postgres...");
    await db.connect();

    if (!config.isUpdate) {
        progress(3, "Creating roles...");

        if (await checkSQLUser(db, "s_su")) {
            await CreateSQLUser(db, "s_su", true, true);
            await db.query("ALTER USER s_su WITH PASSWORD 's_su';");
        }
        if (await checkSQLUser(db, "s_mc")) {
            await CreateSQLUser(db, "s_mc", true);
            await db.query("ALTER USER s_mc WITH PASSWORD 's_mc';");
            await db.query("ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;");
        }
        if (await checkSQLUser(db, "s_mp")) {
            await CreateSQLUser(db, "s_mp");
        }
        if (await checkSQLUser(db, "s_ac")) {
            await CreateSQLUser(db, "s_ac", true);
            await db.query("ALTER USER s_ac WITH PASSWORD 's_ac';");
            await db.query("ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;");
        }
        if (await checkSQLUser(db, "s_ap")) {
            await CreateSQLUser(db, "s_ap");
        }

        if (await checkSQLDatabase(db, config.dbPrefixMeta + "meta")) {
            progress(9, "Creating core database...");
            await CreateSQLDatabase(db, config.dbPrefixMeta + "meta", "s_su");
        }
        if (await checkSQLDatabase(db, config.dbPrefixAuth + "auth")) {
            progress(12, "Creating meta database...");
            await CreateSQLDatabase(db, config.dbPrefixAuth + "auth", "s_su");
        }
    }

    const tempDir = path.join(__dirname, "install_core_temp");

    progress(20, "Unzip...");
    unZipFile(zipFile, tempDir);
    const liquibaseParams = `--username=${config.isUpdate ? config.dbUsername : "s_su"} --password=${
        config.isUpdate ? config.dbPassword : "s_su"
    } --driver=org.postgresql.Driver update`;
    const dbmsPath = path.join(tempDir, "dbms");
    const dbmsAuthPath = path.join(tempDir, "dbms_auth");
    const liquibase = path.join(dbmsPath, "liquibase", "liquibase");

    progress(30, "Migrating meta...");
    if (!isWin32) {
        await exec(`chmod +x ${liquibase}`);
    }

    await exec(
        `cd ${dbmsPath} && ${isWin32 ? "call " : ""}${liquibase}${isWin32 ? ".bat" : ""} --changeLogFile=${path.resolve(
            dbmsPath,
            "db.changelog.xml",
        )} --url=jdbc:postgresql://${conn.hostname}:${conn.port}/${config.dbPrefixMeta}meta ${liquibaseParams}`,
    );

    progress(50, "Migrating auth meta...");
    await exec(
        `cd ${dbmsAuthPath} && ${isWin32 ? "call " : ""}${liquibase}${
            isWin32 ? ".bat" : ""
        } --changeLogFile=${path.resolve(dbmsAuthPath, "db.changelog.meta.xml")} --url=jdbc:postgresql://${
            conn.hostname
        }:${conn.port}/${config.dbPrefixMeta}meta ${liquibaseParams}`,
    );

    progress(55, "Migrating auth...");
    await exec(
        `cd ${dbmsAuthPath} && ${isWin32 ? "call " : ""}${liquibase}${
            isWin32 ? ".bat" : ""
        } --changeLogFile=${path.resolve(dbmsAuthPath, "db.changelog.auth.xml")} --url=jdbc:postgresql://${
            conn.hostname
        }:${conn.port}/${config.dbPrefixAuth}auth ${liquibaseParams}`,
    );

    installDir = getInstallDir(config.appLocation!);
    wwwDir = getInstallDir(config.wwwLocation!);
    if (config.isUpdate) {
        progress(85, "Copy files...");
        if (config.isInstallApp) {
            deleteFolderRecursive(path.resolve(installDir, "ungate"));
            fs.mkdirSync(path.join(installDir, "ungate"), {
                recursive: true,
            });
            await copyFiles(path.join(tempDir, "ungate"), path.join(installDir, "ungate"));
            const packageJson: any = JSON.parse(
                fs.readFileSync(path.join(installDir, "ungate", "package.json"), {encoding: "utf-8"}),
            );

            packageJson.nodemonConfig.env = {
                ...packageJson.nodemonConfig.env,
                GATE_UPLOAD_DIR: path.join(installDir, "tmp"),
                LOGGER_CONF: path.join(installDir, "config", "logger.json"),
                NEDB_TEMP_DB: path.join(installDir, "tmp", "db"),
                PROPERTY_DIR: path.join(installDir, "config"),
            };
            fs.writeFileSync(path.join(installDir, "ungate", "package.json"), JSON.stringify(packageJson, null, 2), {
                encoding: "utf-8",
            });
        }
        if (config.isInstallWww) {
            deleteFolderRecursive(wwwDir);
            fs.mkdirSync(wwwDir, {
                recursive: true,
            });
            await copyFiles(path.join(tempDir, "core"), wwwDir);
        }
    } else {
        const dbMeta = new pg.Client({
            database: `${config.dbPrefixMeta}meta`,
            host: conn.hostname!,
            password: config.dbPassword!,
            port: parseInt(conn.port!, 10),
            user: config.dbUsername!,
        });

        await dbMeta.connect();
        await dbMeta.query(`UPDATE s_mt.t_sys_setting
        SET cv_value='/core-module'
        WHERE ck_id='g_sys_module_url';
        UPDATE s_mt.t_sys_setting
        SET cv_value='/gate-core'
        WHERE ck_id='g_sys_gate_url';
        `);
        progress(75, "Creating catalogs...");
        if (config.isInstallWww) {
            fs.mkdirSync(wwwDir, {
                recursive: true,
            });
            progress(85, "Copy files...");
            await copyFiles(path.join(tempDir, "core"), wwwDir);
        }
        if (config.isInstallApp) {
            for (const dir of ["config", "logs", "tmp", "ungate", "core-module", "core-assets"]) {
                fs.mkdirSync(path.join(installDir, dir), {
                    recursive: true,
                });
            }
            progress(80, "Creating configs...");

            const configFiles = [
                "logger.json",
                "t_context.toml",
                "t_events.toml",
                "t_plugins.toml",
                "t_providers.toml",
                "t_query.toml",
                "t_schedulers.toml",
                "t_servers.toml",
            ];

            const configReplaces = [
                ["#MAIN_LOGS_PATH#", path.join(installDir, "logs", "main.json")],
                ["#ERROR_LOGS_PATH#", path.join(installDir, "logs", "error.log")],
                ["#APP_DIR#", installDir],
                ["#DB_HOST#", `${conn.hostname || "127.0.0.1"}`],
                ["#DB_PORT#", `${conn.port || "5432"}`],
                ["#SERVER_HOST#", os.hostname],
                ["#SERVER_IP#", "127.0.0.1"],
                ["#DB_PREFIX_META#", config.dbPrefixMeta],
                ["#DB_PREFIX_AUTH#", config.dbPrefixAuth],
            ];

            for (const fileName of configFiles) {
                let fileContent = fs.readFileSync(path.join(__dirname, "config", fileName), {encoding: "utf-8"});

                configReplaces.map((replace: any) => {
                    fileContent = fileContent.replace(new RegExp(replace[0]!, "g"), replace[1]!);
                    if (isWin32) {
                        fileContent = fileContent.replace(/\\/g, "\\\\");
                    }
                });
                fs.writeFileSync(path.join(installDir, "config", fileName), fileContent, {encoding: "utf-8"});
            }

            progress(85, "Copy files...");
            await copyFiles(path.join(tempDir, "ungate"), path.join(installDir, "ungate"));

            progress(95, "Patching package...");

            const packageJson: any = JSON.parse(
                fs.readFileSync(path.join(installDir, "ungate", "package.json"), {encoding: "utf-8"}),
            );

            packageJson.nodemonConfig.env = {
                ...packageJson.nodemonConfig.env,
                GATE_UPLOAD_DIR: path.join(installDir, "tmp"),
                LOGGER_CONF: path.join(installDir, "config", "logger.json"),
                NEDB_TEMP_DB: path.join(installDir, "tmp", "db"),
                PROPERTY_DIR: path.join(installDir, "config"),
            };

            fs.writeFileSync(path.join(installDir, "ungate", "package.json"), JSON.stringify(packageJson, null, 2), {
                encoding: "utf-8",
            });
        }
        config.isUpdate = true;
        config.appLocation = getInstallDir(config.appLocation!);
        config.wwwLocation = getInstallDir(config.wwwLocation!);
    }
    fs.writeFileSync(path.join(os.homedir(), ".core_install_conf.json"), JSON.stringify(config, null, 2), {
        encoding: "utf-8",
    });
    if (config.isInstallApp) {
        fs.writeFileSync(path.join(installDir, ".core_install_conf.json"), JSON.stringify(config, null, 2), {
            encoding: "utf-8",
        });
        if (os.platform() !== "win32") {
            await exec("chmod +x *", {
                cwd: path.resolve(installDir, "ungate", "node_modules", ".bin"),
                env: process.env,
            });
            await exec("yarn remove -W node-windows", {
                cwd: path.resolve(installDir, "ungate"),
                env: process.env,
            });
        }
    }
    deleteFolderRecursive(tempDir);
    progress(100, "Finishing...");
};

ipcMain.on("install", async (event, arg) => {
    const config: IInstallConfig = JSON.parse(arg);

    try {
        const progress = ProcessSender(event);

        await install(config, progress);
    } catch (error) {
        console.error(error);
        event.sender.send("install_error", "FATAL ERROR: " + error.message);
    }
});

ipcMain.on("real_path", async (event, arg) => {
    const config: IInstallConfig = JSON.parse(arg);

    event.sender.send(
        "real_path",
        JSON.stringify({
            appLocation: getInstallDir(config.appLocation!),
            ungateLocation: path.resolve(getInstallDir(config.appLocation!), "ungate"),
            wwwLocation: getInstallDir(config.wwwLocation!),
        }),
    );
});

ipcMain.on("close", async () => {
    app.quit();
});

ipcMain.on("select-dirs", async (event, arg) => {
    const {key, config} = JSON.parse(arg);
    const result = await dialog.showOpenDialog(win!, {
        properties: ["openDirectory"],
    });

    if (result.filePaths.length) {
        config[key] = result.filePaths[0];
        event.sender.send("check_config_install", JSON.stringify(config));
    }
});

if (isNotGui) {
    /* eslint-disable sort-keys */
    const config: IInstallConfig = fs.existsSync(path.join(os.homedir(), ".core_install_conf.json"))
        ? JSON.parse(fs.readFileSync(path.join(os.homedir(), ".core_install_conf.json"), {encoding: "utf-8"}))
        : {
              appLocation: getInstallDir("./gate_work"),
              appPort: "8080",
              dbUsername: "postgres",
              dbPassword: "postgres",
              dbConnectString: "postgres://localhost:5432/postgres",
              dbPrefixMeta: "core_",
              dbPrefixAuth: "core_",
              isUpdate: false,
              wwwLocation: getInstallDir("./www_public"),
          };
    /* eslint-enable sort-keys */
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    bar.start(100, 0);
    readConfig(config)
        .then(async () => {
            checkZip();
            await checkNodeJsVersion();
            await checkJavaVersion();
            if (!config.isUpdate) {
                await checkLib(config);
            }
            if (config.isUpdate) {
                await checkVersionUpdateSQLDatabase(config);
            }
        })
        .then(() => {
            return install(config, (num) => {
                bar.update(num);
            });
        })
        .catch((err) => {
            console.error(err);
            app.exit(1);
        })
        .finally(() => {
            bar.stop();
            app.exit();
        });
} else {
    app.on("ready", createWindow);
    app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });
}

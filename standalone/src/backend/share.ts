import * as fs from "fs";
import * as path from "path";
import * as URL from "url";
import * as os from "os";
import pg from "pg";
import { isEmpty, unZipFile, exec, getInstallDir, deleteFolderRecursive } from "./util/base";
import { IInstallConfig } from "./Config.types";
import CopyDir from 'copy-dir';

const NAME_DIR_DBMS_AUTH = "dbms_auth";
const isWin32 = process.platform === "win32";
const zipFile = {
    [NAME_DIR_DBMS_AUTH]: "",
    core: "",
    dbms: "",
    ungate: "",
};
let installDir: string;
let wwwDir: string;

export function checkZip() {
    const files = fs.readdirSync(__dirname);
    const res = files.reduce(
        (obj, file) => {
            if (file.startsWith("ungate") && file.endsWith(".zip")) {
                obj.ungate = true;
                zipFile.ungate = path.resolve(__dirname, file);
            }
            if (file.startsWith("core") && file.endsWith(".zip")) {
                obj.core = true;
                zipFile.core = path.resolve(__dirname, file);
            }
            if (file.startsWith("dbms_auth") && file.endsWith(".zip")) {
                obj[NAME_DIR_DBMS_AUTH] = true;
                zipFile[NAME_DIR_DBMS_AUTH] = path.resolve(__dirname, file);
            }
            if (file.startsWith("dbms_core") && file.endsWith(".zip")) {
                obj.dbms = true;
                zipFile.dbms = path.resolve(__dirname, file);
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

export async function CreateSQLUser(db: pg.Client, user: string, login = false, su = false) {
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

export async function checkSQLDatabase(db: pg.Client, name: string) {
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

export async function checkSQLUser(db: pg.Client, name: string) {
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

export async function CreateSQLDatabase(db: pg.Client, name: string, user: string) {
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

export async function checkVersionUpdateSQLDatabase(config: IInstallConfig) {
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

export async function checkVersionSQLDatabase(config: IInstallConfig) {
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

export async function checkLib(config: IInstallConfig) {
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
export const install = async (config: IInstallConfig, progress: (number, string) => void) => {
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

    const tempDir = path.resolve(os.tmpdir(), "install_core_temp");

    try {
        progress(20, "Unzip...");
        unZipFile(zipFile, tempDir);
        const liquibaseParams = `--username=${config.isUpdate ? config.dbUsername : "s_su"} --password=${
            config.isUpdate ? config.dbPassword : "s_su"
        } --driver=org.postgresql.Driver update`;
        const dbmsPath = path.resolve(tempDir, "dbms");
        const dbmsAuthPath = path.resolve(tempDir, "dbms_auth");
        const liquibase = path.resolve(dbmsPath, "liquibase", "liquibase");

        progress(30, "Migrating meta...");
        if (!isWin32) {
            await exec(`chmod +x ${liquibase}`);
        }

        await exec(
            `${isWin32 ? "call " : ""}${liquibase}${isWin32 ? ".bat" : ""} --changeLogFile=db.changelog.xml --url=jdbc:postgresql://${conn.hostname}:${conn.port}/${config.dbPrefixMeta}meta ${liquibaseParams}`,
            {
                cwd: dbmsPath,
                env: process.env,
            });

        progress(50, "Migrating auth meta...");
        await exec(
            `${isWin32 ? "call " : ""}${liquibase}${
                isWin32 ? ".bat" : ""
            } --changeLogFile=db.changelog.meta.xml --url=jdbc:postgresql://${
                conn.hostname
            }:${conn.port}/${config.dbPrefixMeta}meta ${liquibaseParams}`,
            {
                cwd: dbmsAuthPath,
                env: process.env,
            }
        );

        progress(55, "Migrating auth...");
        await exec(
            `${isWin32 ? "call " : ""}${liquibase}${
                isWin32 ? ".bat" : ""
            } --changeLogFile=db.changelog.auth.xml --url=jdbc:postgresql://${
                conn.hostname
            }:${conn.port}/${config.dbPrefixAuth}auth ${liquibaseParams}`,
         {
            cwd: dbmsAuthPath,
            env: process.env,
        });

        installDir = getInstallDir(config.appLocation!);
        wwwDir = getInstallDir(config.wwwLocation!);
        if (config.isUpdate) {
            progress(85, "Copy files...");
            if (config.isInstallApp) {
                deleteFolderRecursive(path.resolve(installDir, "ungate"));
                fs.mkdirSync(path.resolve(installDir, "ungate"), {
                    recursive: true,
                });
                await copyFiles(path.resolve(tempDir, "ungate"), path.resolve(installDir, "ungate"));
                const packageJson: any = JSON.parse(
                    fs.readFileSync(path.resolve(installDir, "ungate", "package.json"), {encoding: "utf-8"}),
                );

                packageJson.nodemonConfig.env = {
                    ...packageJson.nodemonConfig.env,
                    GATE_UPLOAD_DIR: path.resolve(installDir, "tmp"),
                    LOGGER_CONF: path.resolve(installDir, "config", "logger.json"),
                    NEDB_TEMP_DB: path.resolve(installDir, "tmp", "db"),
                    PROPERTY_DIR: path.resolve(installDir, "config"),
                };
                fs.writeFileSync(path.resolve(installDir, "ungate", "package.json"), JSON.stringify(packageJson, null, 2), {
                    encoding: "utf-8",
                });
            }
            if (config.isInstallWww) {
                deleteFolderRecursive(wwwDir);
                fs.mkdirSync(wwwDir, {
                    recursive: true,
                });
                await copyFiles(path.resolve(tempDir, "core"), wwwDir);
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
            progress(75, "Creating catalogs...");
            if (config.isInstallWww) {
                fs.mkdirSync(wwwDir, {
                    recursive: true,
                });
                progress(85, "Copy files...");
                await copyFiles(path.resolve(tempDir, "core"), wwwDir);
            }
            if (config.isInstallApp) {
                for (const dir of ["config", "logs", "tmp", "ungate", "core-module", "core-assets"]) {
                    fs.mkdirSync(path.resolve(installDir, dir), {
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
                    ["#MAIN_LOGS_PATH#", path.resolve(installDir, "logs", "main.json")],
                    ["#ERROR_LOGS_PATH#", path.resolve(installDir, "logs", "error.log")],
                    ["#APP_DIR#", installDir],
                    ["#DB_HOST#", `${conn.hostname || "127.0.0.1"}`],
                    ["#DB_PORT#", `${conn.port || "5432"}`],
                    ["#SERVER_HOST#", os.hostname],
                    ["#SERVER_IP#", "127.0.0.1"],
                    ["#DB_PREFIX_META#", config.dbPrefixMeta],
                    ["#DB_PREFIX_AUTH#", config.dbPrefixAuth],
                ];

                for (const fileName of configFiles) {
                    let fileContent = fs.readFileSync(path.resolve(__dirname, "config", fileName), {encoding: "utf-8"});

                    configReplaces.map((replace: any) => {
                        fileContent = fileContent.replace(new RegExp(replace[0]!, "g"), replace[1]!);
                        if (isWin32) {
                            fileContent = fileContent.replace(/\\/g, "\\\\");
                        }
                    });
                    fs.writeFileSync(path.resolve(installDir, "config", fileName), fileContent, {encoding: "utf-8"});
                }

                progress(85, "Copy files...");
                await copyFiles(path.resolve(tempDir, "ungate"), path.resolve(installDir, "ungate"));

                progress(95, "Patching package...");

                const packageJson: any = JSON.parse(
                    fs.readFileSync(path.resolve(installDir, "ungate", "package.json"), {encoding: "utf-8"}),
                );

                packageJson.nodemonConfig.env = {
                    ...packageJson.nodemonConfig.env,
                    GATE_UPLOAD_DIR: path.resolve(installDir, "tmp"),
                    LOGGER_CONF: path.resolve(installDir, "config", "logger.json"),
                    NEDB_TEMP_DB: path.resolve(installDir, "tmp", "db"),
                    PROPERTY_DIR: path.resolve(installDir, "config"),
                };

                fs.writeFileSync(path.resolve(installDir, "ungate", "package.json"), JSON.stringify(packageJson, null, 2), {
                    encoding: "utf-8",
                });
            }
            config.isUpdate = true;
            config.appLocation = getInstallDir(config.appLocation!);
            config.wwwLocation = getInstallDir(config.wwwLocation!);
        }
        fs.writeFileSync(path.resolve(os.homedir(), ".core_install_conf.json"), JSON.stringify(config, null, 2), {
            encoding: "utf-8",
        });
        if (config.isInstallApp) {
            fs.writeFileSync(path.resolve(installDir, ".core_install_conf.json"), JSON.stringify(config, null, 2), {
                encoding: "utf-8",
            });
            if (os.platform() !== "win32") {
                await exec("chmod +x *", {
                    cwd: path.resolve(installDir, "ungate", "node_modules", ".bin"),
                    env: process.env,
                });
            }
        }
        
        progress(100, "Finishing...");
    } catch(e) {
        deleteFolderRecursive(tempDir);
        throw e;
    }
};
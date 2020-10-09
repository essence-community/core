const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

function cmdExec (
    command,
    options = {
      env: process.env
    }
  ) {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, options, (error, stdout, stderr) => {
        if (error) {
          error.message += `\n${stderr}`
  
          return reject(error)
        }
        resolve({ stdout, stderr })
      })
    })
  }
function isEmpty(value, allowEmptyString = false) {
    return (
        value == null ||
        (allowEmptyString ? false : value === "") ||
        (Array.isArray(value) && value.length === 0)
    );
}
async function checkSQLDatabase(db, name) {
    try {
        const res = await db.query(
            "select\n" + 
            "    datname\n" + 
            "from\n" + 
            "    pg_database\n" + 
            "where\n" + 
            `    datname = '${name}'\n`,
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

async function CreateSQLUser(db, user, login = false, su = false) {
    try {
        await db.query(
            `CREATE ROLE ${user} WITH ${login ? "" : "NO"}LOGIN ${ su ? 
                "SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION" : 
                "NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION" 
            };`,
        );
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }
}

async function CreateSQLDatabase(db, name, user) {
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

async function checkSQLUser(db, name) {
    try {
        console.log(`Check role ${name}`)
        const res = await db.query(
            "select\n" + 
            "    rolname\n" + 
            "from\n" + 
            "    pg_roles\n" + 
            "where\n" + 
            `    rolname = '${name}'\n`,
        );
        return res.rows.length === 0;
    } catch (error) {
        console.warn(error);
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
    }

    return false;
}

async function checkVersionUpdateSQLDatabase() {
    console.log("Check version db")
    try {
        const db = new Client({
            database: 'core_meta',
            host: process.env.POSTGRES_HOST,
            password: process.env.POSTGRES_ADMIN_USER,
            port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
            user: process.env.POSTGRES_ADMIN_PASSWORD,
        });
        await db.connect();
        const versionApp = fs.readFileSync('/opt/core-backend/VERSION').toString().trim()
        const res = await db.query(
            "SELECT EXISTS (\n" + 
            "   SELECT FROM information_schema.tables \n" + 
            "   WHERE  table_schema = 's_mt'\n" + 
            "   AND    table_name   = 't_sys_setting'\n" + 
            "   ) as cl_exists\n",
        )
        
        if (!res.rows.cl_exists) {
            return true
        }

        const {rows} = await db.query("SELECT cv_value from s_mt.t_sys_setting where ck_id = 'core_db_major_version'");

        return new Promise((resolve, reject) => {
            const [{cv_value: cvValue}] = rows;

            if (!isEmpty(cvValue)) {
                const [MajorNew, MinorNew, PatchNew] = versionApp.split(".").map((val) => parseInt(val, 10));
                const [MajorOld, MinorOld, PatchOld] = cvValue.split(".").map((val) => parseInt(val, 10));

                if (
                    MajorNew < MajorOld ||
                    (MajorNew === MajorOld && MinorNew < MinorOld) ||
                    (MajorNew === MajorOld && MinorNew === MinorOld && PatchNew < PatchOld)
                ) {
                    return resolve(false);
                }
            }
            return resolve(true);
        });
    } catch (error) {
        if (error.code != 42710) {
            throw error;
        } else {
            console.warn(error);
        }
        return false;
    }
}

const init = async () => {
    if (isEmpty(process.env.POSTGRES_HOST) || 
        isEmpty(process.env.POSTGRES_ADMIN_DATABASE) ||
        isEmpty(process.env.POSTGRES_ADMIN_USER) ||
        isEmpty(process.env.POSTGRES_ADMIN_PASSWORD)
    ) {
        return
    }
    console.log("Check and create role")
    const db = new Client({
        database: process.env.POSTGRES_ADMIN_DATABASE,
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_ADMIN_USER,
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        user: process.env.POSTGRES_ADMIN_PASSWORD,
    });
    await db.connect();
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

    if (await checkSQLDatabase(db, "core_meta")) {
        console.log("Creating core database...");
        await CreateSQLDatabase(db, "core_meta", "s_su");
    }
    if (await checkSQLDatabase(db, "core_auth")) {
        console.log("Creating meta database...");
        await CreateSQLDatabase(db, "core_auth", "s_su");
    }
    if (await checkVersionUpdateSQLDatabase()) {
        const versionApp = fs.readFileSync('/opt/core-backend/VERSION').toString().trim()
        const { stdout: minCommitBackend } = await cmdExec('git log -1 --pretty=format:%h', {
            cwd: '/opt/core-backend',
            env: process.env
        })
        const { stdout: fullCommitBackend } = await cmdExec('git log -1 --pretty=format:%H', {
            cwd: '/opt/core-backend',
            env: process.env
        })
        await cmdExec('git checkout -f -- dbms/s_mt/version.sql', {
            cwd: '/opt/core-backend',
            env: process.env
        })
        let versionstr = fs
            .readFileSync('/opt/core-backend/dbms/s_mt/version.sql', { encoding: 'utf-8' })
            .toString()
        
        versionstr += '\n--changeset builder:update_url dbms:postgresql runOnChange:true\n'
        versionstr += "UPDATE s_mt.t_sys_setting SET cv_value='/module' WHERE ck_id='g_sys_module_url';\n"
        versionstr += "UPDATE s_mt.t_sys_setting SET cv_value='/api' WHERE ck_id='g_sys_gate_url';\n"
        versionstr += "UPDATE s_mt.t_sys_setting SET cv_value='/notification' WHERE ck_id='g_sys_ws_gate_url';\n"
        versionstr += `\n--changeset builder:update_${minCommitBackend} dbms:postgresql runOnChange:true\n`
        versionstr += `update s_mt.t_sys_setting set cv_value='${fullCommitBackend}' where ck_id='core_db_commit';\n`
        versionstr += `update s_mt.t_sys_setting set cv_value='${versionApp}' where ck_id='core_db_major_version';\n`
        versionstr +=
                "update s_mt.t_sys_setting set cv_value=to_char(CURRENT_TIMESTAMP, 'dd.MM.YYYY HH24:mm:ss') where ck_id='core_db_deployment_date';\n"
        fs.writeFileSync('/opt/core-backend/dbms/s_mt/version.sql', versionstr, {
            encoding: 'utf-8'
        })
        const liquibaseParams = `--username=${process.env.POSTGRES_ADMIN_USER || "s_su"} --password=${
            process.env.POSTGRES_ADMIN_PASSWORD || "s_su"
        } --driver=org.postgresql.Driver update`;
        await cmdExec(
            `/opt/core-backend/dbms/liquibase/liquibase --changeLogFile=db.changelog.xml --url=jdbc:postgresql://${
                process.env.POSTGRES_HOST
            }:${process.env.POSTGRES_PORT || "5432"}/core_meta ${liquibaseParams}`,
            {
                cwd: '/opt/core-backend/dbms',
                env: process.env,
            }
        );
        await cmdExec(
            `/opt/core-backend/dbms/liquibase/liquibase --changeLogFile=db.changelog.meta.xml --url=jdbc:postgresql://${
                process.env.POSTGRES_HOST
            }:${process.env.POSTGRES_PORT || "5432"}/core_meta ${liquibaseParams}`,
            {
                cwd: '/opt/core-backend/dbms_auth',
                env: process.env,
            }
        );
        await cmdExec(
            `/opt/core-backend/dbms/liquibase/liquibase --changeLogFile=db.changelog.auth.xml --url=jdbc:postgresql://${
                process.env.POSTGRES_HOST
            }:${process.env.POSTGRES_PORT || "5432"}/core_auth ${liquibaseParams}`,
            {
                cwd: '/opt/core-backend/dbms_auth',
                env: process.env,
            }
        );
    }
    
    if (fs.readdirSync("/opt/work_gate/config").length === 0) {
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
            ["#POSTGRES_HOST#", `${process.env.POSTGRES_HOST}`],
            ["#POSTGRES_PORT#", `${process.env.POSTGRES_PORT || "5432"}`],
            ["#GATE_NODE_NAME#", `${process.env.GATE_NODE_NAME}`],
        ];

        for (const fileName of configFiles) {
            let fileContent = fs.readFileSync(path.resolve("/opt/configs_sample", fileName), {encoding: "utf-8"});
            configReplaces.map((replace) => {
                fileContent = fileContent.replace(new RegExp(replace[0], "g"), replace[1]);
            });
            fs.writeFileSync(path.resolve("/opt/work_gate/config", fileName), fileContent, {encoding: "utf-8"});
        }
    }
}

try {
    init().then(() => {
        process.exit(0)
    }, (err) => {
        console.log(err)
        process.exit(1)
    })
} catch (e) {
    console.log(e)
}
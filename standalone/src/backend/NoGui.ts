import * as readline from "readline";
import {IInstallConfig} from "./Config.types";
import {isEmpty, getInstallDir} from "./util/base";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const questionReadline = (question: string): any => {
    return new Promise((resolve) => {
        rl.question(question, (answer?: string) => {
            return resolve(answer);
        });
    });
};

// eslint-disable-next-line max-statements
export const readConfig = async (config: IInstallConfig) => {
    const mode = await questionReadline(
        `Installation mode:\n\t1 - install\n\t2 - update\nmode(${config.isUpdate ? "2" : "1"}):`,
    );

    if (!isEmpty(mode)) {
        config.isUpdate = mode === "2";
    }
    const type = await questionReadline(
        "Type mode:\n\t1 - install all\n\t2 - only Services\n\t3 - only Web app\nmode(1):",
    );

    switch (type) {
        case "2":
            config.isInstallApp = true;
            config.isInstallWww = false;
            break;
        case "3":
            config.isInstallApp = false;
            config.isInstallWww = true;
            break;
        default:
            config.isInstallApp = true;
            config.isInstallWww = true;
            break;
    }
    if (config.isInstallApp) {
        const backEndLocation = await questionReadline(`Choice install services dir? (${config.appLocation}):`);

        if (!isEmpty(backEndLocation)) {
            config.appLocation = getInstallDir(backEndLocation);
        }
    }

    if (config.isInstallWww) {
        const frontEndEndLocation = await questionReadline(`Choice install web app dir? (${config.wwwLocation}):`);

        if (!isEmpty(frontEndEndLocation)) {
            config.wwwLocation = getInstallDir(frontEndEndLocation);
        }
    }

    if (!config.isUpdate && config.isInstallApp) {
        const appPort = await questionReadline(`App listing port? (${config.appPort}):`);

        if (!isEmpty(appPort) && /^\d+$/.test(appPort)) {
            config.appPort = appPort;
        }
    }

    const connectionString = await questionReadline(`Connection string PostgreSql? (${config.dbConnectString}):`);

    if (!isEmpty(connectionString)) {
        config.dbConnectString = connectionString;
    }

    const dbUsername = await questionReadline(`SuperAdmin Username PostgreSql? (${config.dbUsername}):`);

    if (!isEmpty(dbUsername)) {
        config.dbUsername = dbUsername;
    }

    const dbPassword = await questionReadline(`SuperAdmin Password PostgreSql? (${config.dbPassword}):`);

    if (!isEmpty(dbPassword)) {
        config.dbPassword = dbPassword;
    }

    const dbPrefixMeta = await questionReadline(`Database name prefix meta? (${config.dbPrefixMeta}):`);

    if (!isEmpty(dbPrefixMeta)) {
        config.dbPrefixMeta = dbPrefixMeta;
    }

    const dbPrefixAuth = await questionReadline(`Database name prefix authorization? (${config.dbPrefixAuth}):`);

    if (!isEmpty(dbPrefixAuth)) {
        config.dbPrefixAuth = dbPrefixAuth;
    }
};

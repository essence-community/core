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
    const backEndLocation = await questionReadline(`Choice install backend dir? (${config.appLocation}):`);

    if (!isEmpty(backEndLocation)) {
        config.appLocation = getInstallDir(backEndLocation);
    }

    const frontEndEndLocation = await questionReadline(`Choice install frontend dir? (${config.wwwLocation}):`);

    if (!isEmpty(frontEndEndLocation)) {
        config.wwwLocation = getInstallDir(frontEndEndLocation);
    }

    const isUpdate = await questionReadline(`It is update? (${config.isUpdate ? "yes" : "no"}):`);

    if (!isEmpty(isUpdate)) {
        config.isUpdate = isUpdate.toLowerCase() === "yes" || isUpdate.toLowerCase()[0] === "y";
    }

    if (!config.isUpdate) {
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

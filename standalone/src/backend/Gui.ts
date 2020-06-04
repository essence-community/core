import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import fixPath from "fix-path";
import {dialog, app, BrowserWindow, ipcMain} from "electron";
import {IInstallConfig} from "./Config.types";
import {
    getInstallDir,
    checkNodeJsVersion,
    checkJavaVersion,
    ProcessSender,
} from "./util/base";
import { checkZip, checkLib, checkVersionUpdateSQLDatabase, checkVersionSQLDatabase, install } from './share';

// Fixed env PATH
fixPath();

let win: Electron.BrowserWindow | null;

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

app.on("ready", createWindow);
    app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });

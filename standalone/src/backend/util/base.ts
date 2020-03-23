import * as fs from "fs";
import * as path from "path";
import * as childProcess from "child_process";
import AdmZip from "adm-zip";

export function isEmpty(value: any, allowEmptyString = false) {
    return value == null || (allowEmptyString ? false : value === "") || (Array.isArray(value) && value.length === 0);
}
export const deleteFolderRecursive = (pathDir: string) => {
    if (fs.existsSync(pathDir)) {
        if (fs.lstatSync(pathDir).isDirectory()) {
            fs.readdirSync(pathDir).forEach((file) => {
                const curPath = path.join(pathDir, file);

                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath);
                } else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(pathDir);

            return;
        }
        fs.unlinkSync(pathDir);
    }
};

export function unZipFile(zipFile: Record<string, string>, tempDir: string) {
    for (const dir of Object.keys(zipFile)) {
        const fDir = path.join(tempDir, dir);

        fs.mkdirSync(fDir, {
            recursive: true,
        });
        const ziped = new AdmZip(zipFile[dir]);

        ziped.extractAllTo(fDir, true);
    }
}

export const getInstallDir = (appPath: string) => {
    if (appPath[0] === ".") {
        appPath = path.resolve(__dirname, "..", appPath);
    }

    return appPath;
};

export function ProcessSender(e: Electron.IpcMainEvent) {
    return (percent: number, message: string) => {
        e.sender.send(
            "progress",
            JSON.stringify({
                message,
                percent,
            }),
        );
    };
}

export function exec(
    command: string,
    options = {
        cwd: path.resolve(__dirname, ".."),
        env: process.env,
    },
): Promise<{
    stdout: string | Buffer;
    stderr: string | Buffer;
}> {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, options, (error: any, stdout, stderr) => {
            if (error) {
                error.message = `\n${stderr}`;

                return reject(error);
            }
            resolve({stderr, stdout});
        });
    });
}

export function checkJavaVersion() {
    return new Promise((resolve, reject) => {
        const spawn = childProcess.spawn("java", ["-version"]);

        spawn.on("error", (error: Error) => reject(error));
        spawn.stderr.on("data", (data: string) => {
            data = data.toString().split("\n")[0];
            const checkJavaVersion = new RegExp("version").test(data) ? data.split(" ")[2].replace(/"/g, "") : false;

            if (checkJavaVersion != false) {
                return resolve(checkJavaVersion);
            } else {
                reject(new Error("Java not installed"));
            }
        });
    });
}

export async function checkNodeJsVersion() {
    const {stdout} = await exec("node -v");

    return new Promise((resolve, reject) => {
        stdout
            .toString()
            .trim()
            .replace(/^v(\d+)\.[\d\.]+$/, (match, pattern) => {
                if (parseInt(pattern, 10) < 12) {
                    reject(new Error("Need version Node.js 12+"));
                }

                return "";
            });
        resolve();
    });
}

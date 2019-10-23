"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var pg_1 = __importDefault(require("pg"));
var rimraf_1 = __importDefault(require("rimraf"));
var childProcess = require('child_process');
var win;
var createWindow = function () {
    win = new electron_1.BrowserWindow({
        height: 600,
        width: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile(path_1.default.join(__dirname, "../index.html"));
    // win.webContents.openDevTools()
    win.on("closed", function () {
        win = null;
    });
};
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (win === null)
        createWindow();
});
function ProcessSender(e) {
    return function (percent, message) {
        e.sender.send('progress', JSON.stringify({
            message: message,
            percent: percent
        }));
    };
}
function checkJavaVersion() {
    return new Promise(function (resolve, reject) {
        var spawn = childProcess.spawn('java', ['-version']);
        spawn.on('error', function (error) { return reject(error); });
        spawn.stderr.on('data', function (data) {
            data = data.toString().split('\n')[0];
            var checkJavaVersion = new RegExp('version').test(data) ? data.split(' ')[2].replace(/"/g, '') : false;
            if (checkJavaVersion != false) {
                return resolve(checkJavaVersion);
            }
            else {
                reject(new Error('Java not installed'));
            }
        });
    });
}
var getInstallDir = function (config) {
    var appPath = config.appLocation;
    if (appPath[0] === '.') {
        appPath = path_1.default.resolve(__dirname, "..", "..", appPath);
    }
    return appPath;
};
function CreateSQLUser(db, user, login, su) {
    if (login === void 0) { login = false; }
    if (su === void 0) { su = false; }
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.query("CREATE ROLE " + user + " WITH " + (login ? '' : 'NO') + "LOGIN " + (su ? '' : 'NO') + "SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    if (error_1.code != 42710) {
                        throw error_1;
                    }
                    else {
                        console.warn(error_1.message);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function CreateSQLDatabase(db, name, user) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db.query("DROP DATABASE IF EXISTS " + name + ";")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.query("\n            CREATE DATABASE " + name + "\n                WITH \n                OWNER = " + user + "\n                ENCODING = 'UTF8'\n                LC_COLLATE = 'ru_RU.UTF-8'\n                LC_CTYPE = 'ru_RU.UTF-8'\n                TEMPLATE = template0\n                TABLESPACE = pg_default\n                CONNECTION LIMIT = -1;\n        ")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    if (error_2.code != 42710) {
                        throw error_2;
                    }
                    else {
                        console.warn(error_2.message);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function exec(command, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        childProcess.exec(command, options, function (error, stdout, stderr) {
            if (error) {
                error.stderr = stderr;
                return reject(error);
            }
            resolve({ stdout: stdout });
        });
    });
}
electron_1.ipcMain.on('check', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var config, appPath, dir, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = JSON.parse(arg);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                appPath = getInstallDir(config);
                if (!fs_1.default.existsSync(appPath)) {
                    fs_1.default.mkdirSync(appPath);
                }
                if (!fs_1.default.existsSync(appPath)) {
                    throw new Error("Failed to create install directory at path " + appPath + "!");
                }
                dir = fs_1.default.readdirSync(appPath);
                if (dir.length !== 0) {
                    throw new Error('Install directory must be empty!');
                }
                return [4 /*yield*/, checkJavaVersion()];
            case 2:
                _a.sent();
                event.sender.send('check');
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                event.sender.send('check', error_3.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('check_database_connection', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var config, db, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = JSON.parse(arg);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                db = new pg_1.default.Client({
                    host: config.dbHost,
                    port: parseInt(config.dbPort),
                    user: config.dbUsename,
                    password: config.dbPassword,
                    database: "postgres",
                });
                return [4 /*yield*/, db.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, db.query("SELECT 1")];
            case 3:
                _a.sent();
                event.sender.send('check_database_connection');
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                event.sender.send('check_database_connection', "Failed to connect postgres (" + error_4.message + ")");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('install', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var config, db, progress_1, _i, _a, user, _b, _c, dir, _d, _e, dir, installDir, _f, _g, dir, configFiles, configReplaces, _loop_1, _h, configFiles_1, fileName, packageJson, error_5;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                config = JSON.parse(arg);
                _j.label = 1;
            case 1:
                _j.trys.push([1, 35, , 36]);
                db = new pg_1.default.Client({
                    host: config.dbHost,
                    port: parseInt(config.dbPort),
                    user: config.dbUsename,
                    password: config.dbPassword,
                    database: "postgres",
                });
                progress_1 = ProcessSender(event);
                progress_1(1, 'Connecting postgres...');
                return [4 /*yield*/, db.connect()];
            case 2:
                _j.sent();
                progress_1(3, 'Creating roles...');
                return [4 /*yield*/, CreateSQLUser(db, 's_su', true, true)];
            case 3:
                _j.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_mc', true)];
            case 4:
                _j.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_mp')];
            case 5:
                _j.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_ac', true)];
            case 6:
                _j.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_ap')];
            case 7:
                _j.sent();
                _i = 0, _a = ["s_su", "s_mc", "s_ac"];
                _j.label = 8;
            case 8:
                if (!(_i < _a.length)) return [3 /*break*/, 11];
                user = _a[_i];
                return [4 /*yield*/, db.query("ALTER USER " + user + " WITH PASSWORD '" + user + "';")];
            case 9:
                _j.sent();
                _j.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                progress_1(6, 'Settings search paths...');
                return [4 /*yield*/, db.query("ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;")];
            case 12:
                _j.sent();
                return [4 /*yield*/, db.query("ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;")];
            case 13:
                _j.sent();
                progress_1(9, 'Creating core database...');
                return [4 /*yield*/, CreateSQLDatabase(db, config.dbPrefix + 'meta', 's_su')];
            case 14:
                _j.sent();
                progress_1(12, 'Creating meta database...');
                return [4 /*yield*/, CreateSQLDatabase(db, config.dbPrefix + 'auth', 's_su')];
            case 15:
                _j.sent();
                progress_1(13, 'Clearing source directories...');
                _b = 0, _c = ["core-frontend", "core-backend"];
                _j.label = 16;
            case 16:
                if (!(_b < _c.length)) return [3 /*break*/, 20];
                dir = _c[_b];
                dir = path_1.default.resolve(__dirname, '..', '..', dir);
                if (!fs_1.default.existsSync(dir)) return [3 /*break*/, 19];
                if (!(process.platform === 'win32')) return [3 /*break*/, 17];
                rimraf_1.default.sync(dir);
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, exec("rm -Rf " + dir)];
            case 18:
                _j.sent();
                _j.label = 19;
            case 19:
                _b++;
                return [3 /*break*/, 16];
            case 20:
                progress_1(15, 'Fetching core-frontend...');
                return [4 /*yield*/, exec('yarn frontend:clone')];
            case 21:
                _j.sent();
                progress_1(18, 'Fetching core-backend...');
                return [4 /*yield*/, exec('yarn backend:clone')];
            case 22:
                _j.sent();
                _d = 0, _e = ["dbms", "dbms_auth"];
                _j.label = 23;
            case 23:
                if (!(_d < _e.length)) return [3 /*break*/, 28];
                dir = _e[_d];
                progress_1(dir == "dbms" ? 20 : 25, "Migrating " + (dir == "dbms" ? 'meta' : 'auth') + "...");
                dir = path_1.default.resolve(__dirname, '..', '..', 'core-backend', dir);
                if (!(process.platform === 'win32')) return [3 /*break*/, 25];
                return [4 /*yield*/, exec("cd " + dir + "\r\n" + fs_1.default.readFileSync(path_1.default.resolve(dir, 'update.bat'), {
                        encoding: 'utf-8'
                    }))];
            case 24:
                _j.sent();
                return [3 /*break*/, 27];
            case 25: return [4 /*yield*/, exec(path_1.default.resolve(dir, 'update'))];
            case 26:
                _j.sent();
                _j.label = 27;
            case 27:
                _d++;
                return [3 /*break*/, 23];
            case 28:
                progress_1(28, 'Installing backend dependencies...');
                return [4 /*yield*/, exec('yarn backend:install')];
            case 29:
                _j.sent();
                progress_1(32, 'Building backend...');
                return [4 /*yield*/, exec("yarn backend:build")];
            case 30:
                _j.sent();
                progress_1(50, 'Installing frontend dependencies...');
                return [4 /*yield*/, exec('yarn frontend:install')];
            case 31:
                _j.sent();
                progress_1(55, 'Building frontend package...');
                return [4 /*yield*/, exec('yarn frontend:build')];
            case 32:
                _j.sent();
                progress_1(75, 'Creating catalogs...');
                installDir = getInstallDir(config);
                for (_f = 0, _g = ["config", "logs", "tmp", "public"]; _f < _g.length; _f++) {
                    dir = _g[_f];
                    fs_1.default.mkdirSync(path_1.default.resolve(installDir, dir));
                }
                progress_1(80, 'Creating configs...');
                configFiles = [
                    'logger.json',
                    't_context.toml',
                    't_events.toml',
                    't_plugins.toml',
                    't_providers.toml',
                    't_query.toml',
                    't_schedulers.toml',
                    't_servers.toml'
                ];
                configReplaces = [
                    ['#INSTALL_PATH#', installDir],
                    ['#DB_HOST#', config.dbHost],
                    ['#DB_PORT#', config.dbPort],
                    ['#SERVER_HOST#', config.serverHost],
                    ['#SERVER_IP#', config.serverIp],
                    ['#DB_PREFIX#', config.dbPrefix]
                ];
                _loop_1 = function (fileName) {
                    var fileContent = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', '..', 'config', fileName), { encoding: 'utf-8' });
                    configReplaces.map(function (replace) {
                        fileContent = fileContent.replace(new RegExp(replace[0], 'g'), replace[1]);
                    });
                    fs_1.default.writeFileSync(path_1.default.resolve(installDir, 'config', fileName), fileContent, { encoding: "utf-8" });
                };
                for (_h = 0, configFiles_1 = configFiles; _h < configFiles_1.length; _h++) {
                    fileName = configFiles_1[_h];
                    _loop_1(fileName);
                }
                progress_1(84, 'Moving backend...');
                return [4 /*yield*/, exec("cp -R " + path_1.default.resolve(__dirname, '..', '..', 'core-backend', 'bin') + "/* " + installDir)];
            case 33:
                _j.sent();
                progress_1(86, 'Moving frontend...');
                return [4 /*yield*/, exec("cp -R " + path_1.default.resolve(__dirname, '..', '..', 'core-frontend', 'build') + "/* " + installDir + "/public")];
            case 34:
                _j.sent();
                progress_1(90, 'Installing server dependencies...');
                progress_1(95, 'Patching package...');
                packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(installDir, 'package.json'), { encoding: 'utf-8' }));
                packageJson.nodemonConfig.env = __assign(__assign({}, packageJson.nodemonConfig.env), { LOGGER_CONF: installDir + "/logger.json", PROPERTY_DIR: installDir + "/config", GATE_UPLOAD_DIR: installDir + "/tmp", NEDB_TEMP_DB: installDir + "/tmp/db" });
                fs_1.default.writeFileSync(path_1.default.resolve(installDir, 'package.json'), JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' });
                progress_1(98, 'Finishing...');
                setTimeout(function () { return progress_1(100, ''); });
                return [3 /*break*/, 36];
            case 35:
                error_5 = _j.sent();
                console.error(error_5);
                event.sender.send('install_error', 'FATAL ERROR: ' + error_5.message);
                return [3 /*break*/, 36];
            case 36: return [2 /*return*/];
        }
    });
}); });

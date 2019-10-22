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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var fs_1 = __importStar(require("fs"));
var pg_1 = __importDefault(require("pg"));
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
function progress(e, percent, message) {
    e.sender.send('progress', JSON.stringify({
        message: message,
        percent: percent
    }));
}
var getInstallDir = function (config) {
    var appPath = config.appLocation;
    if (appPath[0] === '.') {
        appPath = path_1.default.resolve(__dirname, "..", "..", appPath);
    }
    return appPath;
};
electron_1.ipcMain.on('check_install_path', function (event, arg) {
    var config = JSON.parse(arg);
    try {
        var appPath = getInstallDir(config);
        if (!fs_1.default.existsSync(appPath)) {
            fs_1.default.mkdirSync(appPath);
        }
        if (!fs_1.default.existsSync(appPath)) {
            throw new Error("Failed to create install directory at path " + appPath + "!");
        }
        var dir = fs_1.default.readdirSync(appPath);
        if (dir.length !== 0) {
            throw new Error('Install directory must be empty!');
        }
        event.sender.send('check_install_path');
    }
    catch (error) {
        event.sender.send('check_install_path', error.message);
    }
});
electron_1.ipcMain.on('check_database_connection', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    var config, db, error_1;
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
                error_1 = _a.sent();
                event.sender.send('check_database_connection', "Failed to connect postgres (" + error_1.message + ")");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function CreateSQLUser(db, user, login, su) {
    if (login === void 0) { login = false; }
    if (su === void 0) { su = false; }
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.query("CREATE ROLE " + user + " WITH " + (login ? '' : 'NO') + "LOGIN " + (su ? '' : 'NO') + "SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    if (!error_2.message.match("already exists")) {
                        throw error_2;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function CreateSQLDatabase(db, name, user) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
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
                    error_3 = _a.sent();
                    if (!error_3.message.match("already exists")) {
                        throw error_3;
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
electron_1.ipcMain.on('install', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    var config, db, installDir, configFiles, configReplaces, _loop_1, _i, configFiles_1, fileName, packageJson, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = JSON.parse(arg);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 36, , 37]);
                db = new pg_1.default.Client({
                    host: config.dbHost,
                    port: parseInt(config.dbPort),
                    user: config.dbUsename,
                    password: config.dbPassword,
                    database: "postgres",
                });
                progress(event, 1, 'Connecting postgres...');
                return [4 /*yield*/, db.connect()];
            case 2:
                _a.sent();
                progress(event, 3, 'Creating roles...');
                return [4 /*yield*/, CreateSQLUser(db, 's_su', true, true)];
            case 3:
                _a.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_mc', true)];
            case 4:
                _a.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_mp')];
            case 5:
                _a.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_ac', true)];
            case 6:
                _a.sent();
                return [4 /*yield*/, CreateSQLUser(db, 's_ap')];
            case 7:
                _a.sent();
                return [4 /*yield*/, db.query("ALTER USER s_su WITH PASSWORD 's_su';")];
            case 8:
                _a.sent();
                return [4 /*yield*/, db.query("ALTER USER s_mc WITH PASSWORD 's_mc';")];
            case 9:
                _a.sent();
                return [4 /*yield*/, db.query("ALTER USER s_ac WITH PASSWORD 's_ac';")];
            case 10:
                _a.sent();
                progress(event, 6, 'Settings search paths...');
                return [4 /*yield*/, db.query("ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;")];
            case 11:
                _a.sent();
                return [4 /*yield*/, db.query("ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;")];
            case 12:
                _a.sent();
                progress(event, 9, 'Creating core database...');
                return [4 /*yield*/, CreateSQLDatabase(db, 'core', 's_su')];
            case 13:
                _a.sent();
                progress(event, 12, 'Creating core_auth database...');
                return [4 /*yield*/, CreateSQLDatabase(db, 'core_auth', 's_su')];
            case 14:
                _a.sent();
                progress(event, 15, 'Migrating core...');
                return [4 /*yield*/, exec(path_1.default.resolve(__dirname, '..', '..', 'core-backend', 'dbms', 'update' + (process.platform === 'win32' ? '.bat' : '')))];
            case 15:
                _a.sent();
                progress(event, 20, 'Migrating core_auth...');
                return [4 /*yield*/, exec(path_1.default.resolve(__dirname, '..', '..', 'core-backend', 'dbms_auth', 'update' + (process.platform === 'win32' ? '.bat' : '')))];
            case 16:
                _a.sent();
                return [4 /*yield*/, exec('rm -R ' + path_1.default.resolve(__dirname, '..', '..', 'core-frontend'))];
            case 17:
                _a.sent();
                return [4 /*yield*/, exec('rm -R ' + path_1.default.resolve(__dirname, '..', '..', 'core-backend'))];
            case 18:
                _a.sent();
                progress(event, 24, 'Fetching core-frontend...');
                return [4 /*yield*/, exec('git clone https://github.com/essence-community/core-frontend.git')];
            case 19:
                _a.sent();
                progress(event, 26, 'Fetching core-backend...');
                return [4 /*yield*/, exec('git clone https://github.com/essence-community/core-backend.git')];
            case 20:
                _a.sent();
                progress(event, 28, 'Installing backend dependencies...');
                return [4 /*yield*/, exec('yarn yarn:backend:install')];
            case 21:
                _a.sent();
                progress(event, 30, 'Building plugins...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:plugins')];
            case 22:
                _a.sent();
                progress(event, 32, 'Building contexts...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:contexts')];
            case 23:
                _a.sent();
                progress(event, 34, 'Building events...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:events')];
            case 24:
                _a.sent();
                progress(event, 36, 'Building schedulers...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:schedulers')];
            case 25:
                _a.sent();
                progress(event, 38, 'Building providers...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:providers')];
            case 26:
                _a.sent();
                progress(event, 40, 'Building server...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:server')];
            case 27:
                _a.sent();
                progress(event, 42, 'Building plugininf...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:plugininf')];
            case 28:
                _a.sent();
                progress(event, 44, 'Building libs...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:libs')];
            case 29:
                _a.sent();
                progress(event, 46, 'Copyring certs...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:cert')];
            case 30:
                _a.sent();
                progress(event, 48, 'Copyring package...');
                return [4 /*yield*/, exec('yarn yarn:backend:build:copy')];
            case 31:
                _a.sent();
                progress(event, 50, 'Installing frontend dependencies...');
                return [4 /*yield*/, exec('yarn yarn:frontend:install')];
            case 32:
                _a.sent();
                progress(event, 55, 'Building frontend package...');
                return [4 /*yield*/, exec('yarn yarn:frontend:build')];
            case 33:
                _a.sent();
                progress(event, 75, 'Creating catalogs...');
                installDir = getInstallDir(config);
                fs_1.mkdirSync(path_1.default.resolve(installDir, 'config'));
                fs_1.mkdirSync(path_1.default.resolve(installDir, 'logs'));
                fs_1.mkdirSync(path_1.default.resolve(installDir, 'tmp'));
                fs_1.mkdirSync(path_1.default.resolve(installDir, 'public'));
                progress(event, 80, 'Creating configs...');
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
                ];
                _loop_1 = function (fileName) {
                    var fileContent = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', '..', 'config', fileName), { encoding: 'utf-8' });
                    configReplaces.map(function (replace) {
                        fileContent = fileContent.replace(new RegExp(replace[0], 'g'), replace[1]);
                    });
                    fs_1.default.writeFileSync(path_1.default.resolve(installDir, 'config', fileName), fileContent, { encoding: "utf-8" });
                };
                for (_i = 0, configFiles_1 = configFiles; _i < configFiles_1.length; _i++) {
                    fileName = configFiles_1[_i];
                    _loop_1(fileName);
                }
                progress(event, 84, 'Moving backend...');
                return [4 /*yield*/, exec("cp -R " + path_1.default.resolve(__dirname, '..', '..', 'core-backend', 'bin') + "/* " + installDir)];
            case 34:
                _a.sent();
                progress(event, 86, 'Moving frontend...');
                return [4 /*yield*/, exec("cp -R " + path_1.default.resolve(__dirname, '..', '..', 'core-frontend', 'build') + "/* " + installDir + "/public")];
            case 35:
                _a.sent();
                progress(event, 90, 'Installing server dependencies...');
                progress(event, 95, 'Patching package...');
                packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(installDir, 'package.json'), { encoding: 'utf-8' }));
                packageJson.nodemonConfig.env = __assign({}, packageJson.nodemonConfig.env, { LOGGER_CONF: installDir + "/logger.json", PROPERTY_DIR: installDir + "/config", GATE_UPLOAD_DIR: installDir + "/tmp", NEDB_TEMP_DB: installDir + "/tmp/db" });
                fs_1.default.writeFileSync(path_1.default.resolve(installDir, 'package.json'), JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' });
                progress(event, 98, 'Finishing...');
                setTimeout(function () { return progress(event, 100, ''); });
                return [3 /*break*/, 37];
            case 36:
                error_4 = _a.sent();
                event.sender.send('install_error', 'FATAL ERROR: ' + error_4.message);
                return [3 /*break*/, 37];
            case 37: return [2 /*return*/];
        }
    });
}); });

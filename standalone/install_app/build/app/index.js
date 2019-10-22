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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var core_1 = require("@flow-ui/core");
var dark_1 = __importDefault(require("@flow-ui/core/misc/themes/dark"));
var GeneralSetup_1 = __importDefault(require("./steps/GeneralSetup"));
var DatabaseSetup_1 = __importDefault(require("./steps/DatabaseSetup"));
var Installing_1 = __importDefault(require("./steps/Installing"));
var steps = [
    GeneralSetup_1.default,
    DatabaseSetup_1.default,
    Installing_1.default
];
var defaultConfig = {
    serverHost: 'core.localhost',
    serverIp: '127.0.0.1',
    appLocation: "./core",
    appPort: "8080",
    dbHost: "localhost",
    dbPort: "5432",
    dbUsename: "postgres",
    dbPassword: "postgres",
};
var App = function () {
    var _a = react_1.useState(defaultConfig), config = _a[0], setConfig = _a[1];
    var _b = react_1.useState(1), step = _b[0], setStep = _b[1];
    var _c = react_1.useState("Installation"), title = _c[0], setTitle = _c[1];
    var _d = react_1.useState(""), subtitle = _d[0], setSubtitle = _d[1];
    var Step = steps[step - 1];
    return (react_1.default.createElement(core_1.Viewport, { theme: dark_1.default },
        react_1.default.createElement(core_1.Panel, null,
            react_1.default.createElement(core_1.Flexbox, { justifyContent: "space-between", alignItems: "center" },
                react_1.default.createElement(core_1.Block, null,
                    react_1.default.createElement(core_1.H1, null, title),
                    react_1.default.createElement(core_1.C1, { color: function (c) { return c.light.hex(); } }, subtitle)),
                react_1.default.createElement(core_1.T1, { color: function (c) { return c.light.hex(); } },
                    "Step: ",
                    step,
                    "/",
                    steps.length))),
        react_1.default.createElement(core_1.Block, { mt: "3rem" },
            react_1.default.createElement(Step, { onNext: function () {
                    setStep(step + 1);
                }, onPrev: function () {
                    setStep(step - 1);
                }, setTitle: setTitle, setSubtitle: setSubtitle, config: config, setConfig: function (cfg) { return setConfig(__assign({}, config, cfg)); } }))));
};
react_dom_1.default.render(react_1.default.createElement(App, null), document.getElementById('app'));

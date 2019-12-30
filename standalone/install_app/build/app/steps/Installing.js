"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@flow-ui/core");
var react_1 = __importStar(require("react"));
var electron_1 = require("electron");
var Installing = function (props) {
    var _a = react_1.useState('Installing...'), message = _a[0], setMessage = _a[1];
    var _b = react_1.useState(''), error = _b[0], setError = _b[1];
    var _c = react_1.useState(0), progress = _c[0], setProgress = _c[1];
    react_1.useEffect(function () {
        props.setTitle('Installing');
        props.setSubtitle('Wait until complete, it may take a couple of minutes');
        electron_1.ipcRenderer.on('progress', function (event, arg) {
            var pkg = JSON.parse(arg);
            setMessage(pkg.message);
            setProgress(pkg.percent);
            if (pkg.percent == 100) {
                props.onNext();
            }
        });
        electron_1.ipcRenderer.on('install_error', function (event, arg) {
            setError(arg);
        });
        electron_1.ipcRenderer.send('install', JSON.stringify(props.config));
    }, []);
    return (react_1.default.createElement(core_1.Block, null,
        react_1.default.createElement(core_1.Block, { p: "1rem", pt: "5rem" },
            react_1.default.createElement(core_1.Flexbox, { column: true },
                react_1.default.createElement(core_1.Block, { flex: 1 },
                    react_1.default.createElement(core_1.Meter, { shape: "square", size: "xlarge", color: function (c) { return error.length ? c.accent.red.hex() : c.primary.hex(); }, decoration: "outline", animated: true, percent: progress })),
                react_1.default.createElement(core_1.C1, { color: function (c) { return c.light.hex(); } }, message),
                error && (react_1.default.createElement(core_1.Block, null,
                    react_1.default.createElement(core_1.Divider, null),
                    react_1.default.createElement(core_1.C1, { color: function (c) { return c.accent.red.hex(); } },
                        react_1.default.createElement(core_1.Icon, { size: "1.5rem", pr: "0.5rem", type: function (t) { return t.outline.alertTriangle; } }),
                        " ",
                        error))))),
        react_1.default.createElement(core_1.Panel, { align: "bottom", borderWidth: 0, p: "1rem" },
            react_1.default.createElement(core_1.Flexbox, { justifyContent: "flex-end" },
                react_1.default.createElement(core_1.Flexbox, { flex: 1 },
                    react_1.default.createElement(core_1.Button, { decoration: "outline", onClick: function () {
                            setError('');
                            setMessage('Retrying...');
                            setProgress(0);
                            electron_1.ipcRenderer.send('install', JSON.stringify(props.config));
                        }, children: "Retry installation" })),
                react_1.default.createElement(core_1.Button, { onClick: function () {
                        electron_1.ipcRenderer.send('close');
                    }, children: "Close" })))));
};
exports.default = Installing;

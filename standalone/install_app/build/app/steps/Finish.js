"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var core_1 = require("@flow-ui/core");
var electron_1 = require("electron");
var Finish = function (props) {
    react_1.useEffect(function () {
        props.setTitle('Complete');
        props.setSubtitle('Installation complete successfully');
    }, []);
    return (react_1.default.createElement(core_1.Block, null,
        react_1.default.createElement(core_1.Block, { p: "1rem", pt: "5rem" },
            react_1.default.createElement(core_1.Block, null,
                react_1.default.createElement(core_1.C3, { color: function (c) { return c.accent.orange.hex(); } }, "To start server, run command \"yarn server\" from installation directory"))),
        react_1.default.createElement(core_1.Panel, { align: "bottom", borderWidth: 0, p: "1rem" },
            react_1.default.createElement(core_1.Flexbox, { justifyContent: "flex-end" },
                react_1.default.createElement(core_1.Flexbox, { flex: 1 },
                    react_1.default.createElement(core_1.Button, { decoration: "outline", onClick: function () {
                            electron_1.ipcRenderer.send('open_installation_dir');
                        }, children: "Show installation directory" })),
                react_1.default.createElement(core_1.Button, { onClick: function () {
                        electron_1.ipcRenderer.send('close');
                    }, children: "Close" })))));
};
exports.default = Finish;

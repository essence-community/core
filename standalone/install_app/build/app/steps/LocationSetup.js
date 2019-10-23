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
var LocationSetup = function (props) {
    react_1.useEffect(function () {
        props.setTitle('General setup');
        props.setSubtitle('Setup general properties');
        electron_1.ipcRenderer.on('check', function (event, arg) {
            if (!arg) {
                props.onNext();
                return;
            }
            core_1.notify({
                title: 'Error',
                message: arg,
                timeout: 5000
            });
        });
    }, []);
    return (react_1.default.createElement(core_1.Block, null,
        react_1.default.createElement(core_1.Block, { p: "1rem", pt: "5rem" },
            react_1.default.createElement(core_1.TextField, { label: "Install location", value: props.config.appLocation, onChange: function (e) {
                    props.setConfig({
                        appLocation: e.target.value
                    });
                }, hint: "Provide path where you would like to install app", mb: "1rem" }),
            react_1.default.createElement(core_1.TextField, { label: "Port", value: props.config.appPort, onChange: function (e) {
                    props.setConfig({
                        appPort: e.target.value
                    });
                }, hint: "Provide http port where app willbe running", mb: "1rem" })),
        react_1.default.createElement(core_1.Panel, { align: "bottom" },
            react_1.default.createElement(core_1.Flexbox, { justifyContent: "flex-end" },
                react_1.default.createElement(core_1.Button, { onClick: function () {
                        electron_1.ipcRenderer.send('check', JSON.stringify(props.config));
                    }, children: (react_1.default.createElement(core_1.Flexbox, null,
                        "Next",
                        react_1.default.createElement(core_1.Icon, { size: "1rem", pl: "0.5rem", type: function (t) { return t.outline.arrowIosForward; } }))) })))));
};
exports.default = LocationSetup;
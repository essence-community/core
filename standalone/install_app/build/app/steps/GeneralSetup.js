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
var GeneralSetup = function (props) {
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
            react_1.default.createElement(core_1.Flexbox, { flex: 1 },
                react_1.default.createElement(core_1.TextField, { flex: 1, label: "Install location", value: props.config.appLocation, onChange: function (e) {
                        props.setConfig({
                            appLocation: e.target.value
                        });
                    }, hint: "Provide path where you would like to install app", mb: "2rem" })),
            react_1.default.createElement(core_1.Flexbox, null,
                react_1.default.createElement(core_1.TextField, { flex: 1, label: "Hostname", value: props.config.serverHost, onChange: function (e) {
                        props.setConfig({
                            serverHost: e.target.value
                        });
                    }, mb: "1rem" }),
                react_1.default.createElement(core_1.TextField, { flex: 1, label: "Self IP", value: props.config.serverIp, onChange: function (e) {
                        props.setConfig({
                            serverIp: e.target.value
                        });
                    }, mb: "1rem", mr: "0.5rem", ml: "0.5rem" }),
                react_1.default.createElement(core_1.TextField, { flex: 1, label: "Listen port", value: props.config.appPort, onChange: function (e) {
                        props.setConfig({
                            appPort: e.target.value
                        });
                    }, mb: "1rem" }))),
        react_1.default.createElement(core_1.Panel, { align: "bottom", borderWidth: 0, p: "1rem" },
            react_1.default.createElement(core_1.Flexbox, { justifyContent: "flex-end" },
                react_1.default.createElement(core_1.Button, { onClick: function () {
                        electron_1.ipcRenderer.send('check', JSON.stringify(props.config));
                    }, children: (react_1.default.createElement(core_1.Flexbox, null,
                        "Next",
                        react_1.default.createElement(core_1.Icon, { size: "1rem", pl: "0.5rem", type: function (t) { return t.outline.arrowIosForward; } }))) })))));
};
exports.default = GeneralSetup;

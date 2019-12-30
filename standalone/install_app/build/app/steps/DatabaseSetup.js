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
        props.setTitle('Database');
        props.setSubtitle('Setup postgres settings');
        electron_1.ipcRenderer.on('check_database_connection', function (event, arg) {
            if (!arg) {
                core_1.notify({
                    title: 'Connection',
                    message: "Success!",
                    timeout: 3000
                });
                return;
            }
            core_1.notify({
                title: 'Connection',
                message: arg,
                timeout: 5000
            });
        });
    }, []);
    return (react_1.default.createElement(core_1.Block, null,
        react_1.default.createElement(core_1.Block, { p: "1rem", pt: "5rem" },
            react_1.default.createElement(core_1.Flexbox, { flex: 1 },
                react_1.default.createElement(core_1.TextField, { flex: 1, mr: "1rem", label: "Host", value: props.config.dbHost, onChange: function (e) { return props.setConfig({
                        dbHost: e.target.value
                    }); }, mb: "1rem" }),
                react_1.default.createElement(core_1.TextField, { label: "Port", type: "number", value: props.config.dbPort, onChange: function (e) { return props.setConfig({
                        dbPort: e.target.value
                    }); }, mb: "1rem" })),
            react_1.default.createElement(core_1.Flexbox, null,
                react_1.default.createElement(core_1.TextField, { flex: 1, mr: "1rem", label: "Username", value: props.config.dbUsename, onChange: function (e) { return props.setConfig({
                        dbUsename: e.target.value
                    }); }, mb: "1rem" }),
                react_1.default.createElement(core_1.TextField, { flex: 1, label: "Password", value: props.config.dbPassword, onChange: function (e) { return props.setConfig({
                        dbPassword: e.target.value
                    }); }, mb: "1rem" })),
            react_1.default.createElement(core_1.TextField, { flex: 1, label: "Database prefix", value: props.config.dbPrefix, onChange: function (e) { return props.setConfig({
                    dbPrefix: e.target.value
                }); }, mb: "1rem" }),
            react_1.default.createElement(core_1.C3, { color: function (c) { return c.accent.orange.hex(); }, children: (react_1.default.createElement(core_1.Flexbox, { alignItems: "center" },
                    react_1.default.createElement(core_1.Icon, { size: "1.5rem", pr: "0.5rem", type: function (t) { return t.outline.alertTriangle; } }),
                    " Credential should be with admin access. Installaction process will create core users")) }),
            react_1.default.createElement(core_1.Divider, { mt: "1rem", mb: "1rem" }),
            react_1.default.createElement(core_1.C3, { color: function (c) { return c.light.hex(); } },
                "Installation will create \"",
                props.config.dbPrefix,
                "meta\" and \"",
                props.config.dbPrefix,
                "auth\" databases")),
        react_1.default.createElement(core_1.Panel, { align: "bottom", borderWidth: 0, p: "1rem" },
            react_1.default.createElement(core_1.Flexbox, { justifyContent: "flex-end" },
                react_1.default.createElement(core_1.Button, { color: function (c) { return c.accent.orange.hex(); }, onClick: function () {
                        electron_1.ipcRenderer.send('check_database_connection', JSON.stringify(props.config));
                    }, children: (react_1.default.createElement(core_1.Flexbox, null,
                        react_1.default.createElement(core_1.Icon, { size: "1rem", pr: "0.5rem", type: function (t) { return t.outline.swap; } }),
                        "Check connection")) }),
                react_1.default.createElement(core_1.Block, { flex: 1 }),
                react_1.default.createElement(core_1.Button, { decoration: "text", mr: "1rem", onClick: props.onPrev, children: (react_1.default.createElement(core_1.Flexbox, null,
                        react_1.default.createElement(core_1.Icon, { size: "1rem", pr: "0.5rem", type: function (t) { return t.outline.arrowIosBack; } }),
                        "Back")) }),
                react_1.default.createElement(core_1.Button, { onClick: props.onNext, children: (react_1.default.createElement(core_1.Flexbox, null,
                        "Next",
                        react_1.default.createElement(core_1.Icon, { size: "1rem", pl: "0.5rem", type: function (t) { return t.outline.arrowIosForward; } }))) })))));
};
exports.default = LocationSetup;

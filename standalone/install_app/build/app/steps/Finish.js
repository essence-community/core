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
var Finish = function (props) {
    react_1.useEffect(function () {
        props.setTitle('Complete');
        props.setSubtitle('Installation complete successfully');
    }, []);
    return (react_1.default.createElement(core_1.Block, null,
        react_1.default.createElement(core_1.Block, { p: "1rem", pt: "5rem" },
            react_1.default.createElement(core_1.C3, { color: function (c) { return c.accent.orange.hex(); } }, "To start server, please goto installation dir "),
            react_1.default.createElement(core_1.C3, { color: function (c) { return c.accent.orange.hex(); } }, "& run command \"yarn && yarn server\""))));
};
exports.default = Finish;

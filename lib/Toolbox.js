"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbox = exports.AbstractBlockView = void 0;
const react_1 = __importDefault(require("react"));
const react_dnd_1 = require("react-dnd");
const utils_js_1 = require("./utils.js");
const portStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: utils_js_1.portRadius * 2,
    height: utils_js_1.portRadius * 2,
    borderRadius: utils_js_1.portRadius,
    border: `1px solid ${utils_js_1.defaultBorderColor}`,
    backgroundColor: utils_js_1.defaultBackgroundColor,
    boxSizing: "border-box",
};
function AbstractBlockView({ kind, schema, }) {
    const block = schema[kind];
    const [_, drag] = react_dnd_1.useDrag({ item: { type: "block", kind } });
    return (react_1.default.createElement("div", { ref: drag, style: {
            cursor: "move",
            margin: "1em",
            display: "flex",
            alignItems: "center",
            padding: utils_js_1.portMargin,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: utils_js_1.defaultBorderColor,
            backgroundColor: block.backgroundColor || utils_js_1.defaultBackgroundColor,
        } },
        react_1.default.createElement("div", { style: {
                flex: 1,
                marginLeft: utils_js_1.portMargin / 2,
                marginRight: utils_js_1.portMargin / 2,
            } }, block.name)));
}
exports.AbstractBlockView = AbstractBlockView;
function Toolbox({ schema, }) {
    return (react_1.default.createElement("div", { style: { display: "flex" }, className: "toolbox" }, Object.keys(schema).map((key) => {
        const kind = key;
        return react_1.default.createElement(AbstractBlockView, { key: kind, kind: kind, schema: schema });
    })));
}
exports.Toolbox = Toolbox;
//# sourceMappingURL=Toolbox.js.map
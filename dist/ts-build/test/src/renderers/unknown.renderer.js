"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("./JSX");
const renderer_1 = require("../core/renderer");
class UnknownRenderer extends renderer_1.Renderer {
    render() {
        return (JSX_1.JSX.createElement("div", { style: { color: 'red' } }, "No applicable renderer found."));
    }
}
exports.UnknownRenderer = UnknownRenderer;
//# sourceMappingURL=unknown.renderer.js.map
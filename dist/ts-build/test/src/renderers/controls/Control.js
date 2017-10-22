"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = require("../../core/renderer");
const actions_1 = require("../../actions");
class Control extends renderer_1.Renderer {
    updateData(value) {
        this.props.dispatch(actions_1.update(this.props.path, () => value));
    }
}
exports.Control = Control;
//# sourceMappingURL=Control.js.map
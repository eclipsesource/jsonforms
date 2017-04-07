"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../core");
exports.JsonFormsRenderer = function (config) {
    return function (cls) {
        customElements.define(config.selector, cls);
        core_1.JsonFormsHolder.rendererService.registerRenderer(config.tester, config.selector);
    };
};
//# sourceMappingURL=renderer.util.js.map
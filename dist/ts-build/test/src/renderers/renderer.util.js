"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * Renderer annotation that defines the renderer as a custom elemeent
 * and registers it with the renderer service.
 *
 * @param {JsonFormsRendererConfig} config the renderer config to be registered
 * @constructor
 */
// Used as annotation
// tslint:disable:variable-name
exports.JsonFormsRenderer = (config) => (cls) => {
    if (customElements.get(config.selector)) {
        return;
    }
    customElements.define(config.selector, cls);
    core_1.JsonForms.rendererService.registerRenderer(config.tester, config.selector);
};
// tslint:enable:variable-name
//# sourceMappingURL=renderer.util.js.map
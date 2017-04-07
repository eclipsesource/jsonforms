"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uischema_registry_1 = require("./core/uischema.registry");
var renderer_service_1 = require("./core/renderer.service");
exports.JsonFormsServiceElement = function (config) { return function (cls) {
    JsonFormsHolder.jsonFormsServices.push(cls);
}; };
var JsonFormsHolder = (function () {
    function JsonFormsHolder() {
    }
    return JsonFormsHolder;
}());
JsonFormsHolder.rendererService = new renderer_service_1.RendererService();
JsonFormsHolder.jsonFormsServices = [];
JsonFormsHolder.uischemaRegistry = new uischema_registry_1.UiSchemaRegistryImpl();
exports.JsonFormsHolder = JsonFormsHolder;
//# sourceMappingURL=core.js.map
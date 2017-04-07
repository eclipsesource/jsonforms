"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("./runtime");
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Renderer.prototype.setUiSchema = function (uischema) {
        this.uischema = uischema;
    };
    Renderer.prototype.setDataService = function (dataService) {
        this.dataService = dataService;
    };
    Renderer.prototype.setDataSchema = function (dataSchema) {
        this.dataSchema = dataSchema;
    };
    Renderer.prototype.notify = function (type) {
        //
    };
    Renderer.prototype.connectedCallback = function () {
        if (!this.uischema.hasOwnProperty('runtime')) {
            var runtime_2 = new runtime_1.Runtime();
            this.uischema['runtime'] = runtime_2;
        }
        var runtime = this.uischema['runtime'];
        runtime.addListener(this);
        this.render();
    };
    Renderer.prototype.disconnectedCallback = function () {
        this.dispose();
        var runtime = this.uischema['runtime'];
        runtime.removeListener(this);
    };
    return Renderer;
}(HTMLElement));
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map
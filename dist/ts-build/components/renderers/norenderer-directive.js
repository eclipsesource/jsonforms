"use strict";
var NoRendererDirective = (function () {
    function NoRendererDirective() {
        this.restrict = 'E';
        this.template = "\n        <div style=\"display:none\">\n            <span>No Renderer for {{vm.uischema.type}}.</span>\n            <span>Full element: {{vm.uischema}}.</span>\n        </div>\n    ";
        this.controller = NoRendererController;
        this.controllerAs = 'vm';
    }
    return NoRendererDirective;
}());
var NoRendererController = (function () {
    function NoRendererController(scope) {
        this.scope = scope;
        this.uischema = scope['uischema'];
    }
    NoRendererController.$inject = ['$scope'];
    return NoRendererController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.norenderer', [])
    .directive('norenderer', function () { return new NoRendererDirective(); })
    .name;
//# sourceMappingURL=norenderer-directive.js.map
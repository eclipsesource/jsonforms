"use strict";
var testers_1 = require('../../testers');
var LabelDirective = (function () {
    function LabelDirective() {
        this.restrict = 'E';
        this.template = "<jsonforms-widget class=\"jsf-label\">{{vm.text}}<hr></jsonforms-widget>";
        this.controller = LabelController;
        this.controllerAs = 'vm';
    }
    return LabelDirective;
}());
var LabelController = (function () {
    function LabelController(scope) {
        this.scope = scope;
        this.text = scope['uischema']['text'];
    }
    Object.defineProperty(LabelController.prototype, "size", {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    LabelController.$inject = ['$scope'];
    return LabelController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.extras.label', ['jsonforms.renderers'])
    .directive('labelControl', function () { return new LabelDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('label-control', testers_1.uiTypeIs('Label'), 2);
    }
])
    .name;
//# sourceMappingURL=label.directive.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var testers_1 = require('../../testers');
var BooleanDirective = (function () {
    function BooleanDirective() {
        this.restrict = 'E';
        this.templateUrl = 'boolean.html';
        this.controller = BooleanController;
        this.controllerAs = 'vm';
    }
    return BooleanDirective;
}());
var BooleanController = (function (_super) {
    __extends(BooleanController, _super);
    function BooleanController(scope) {
        _super.call(this, scope);
    }
    BooleanController.$inject = ['$scope'];
    return BooleanController;
}(abstract_control_1.AbstractControl));
var booleanTemplate = "<jsonforms-control>\n  <input type=\"checkbox\"\n         id=\"{{vm.id}}\"\n         class=\"jsf-control-boolean\"\n         ng-model=\"vm.resolvedData[vm.fragment]\"\n         ng-change='vm.triggerChangeEvent()'\n         ng-disabled=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.boolean', ['jsonforms.renderers.controls'])
    .directive('booleanControl', function () { return new BooleanDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('boolean-control', testers_1.schemaTypeIs('boolean'), 1);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('boolean.html', booleanTemplate);
    }])
    .name;
//# sourceMappingURL=boolean.directive.js.map
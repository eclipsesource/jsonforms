"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var testers_1 = require('../../testers');
var enumTemplate = "<jsonforms-control>\n      <select ng-options=\"option as option for option in vm.options\"\n              id=\"{{vm.id}}\"\n              class=\"form-control jsf-control-enum\" \n              ng-change='vm.triggerChangeEvent()'\n              ng-model=\"vm.resolvedData[vm.fragment]\"\n              ng-readonly=\"vm.uiSchema.readOnly\">\n      </select>  \n</jsonforms-control>";
var EnumDirective = (function () {
    function EnumDirective() {
        this.restrict = 'E';
        this.templateUrl = 'enum.html';
        this.controller = EnumController;
        this.controllerAs = 'vm';
    }
    return EnumDirective;
}());
var EnumController = (function (_super) {
    __extends(EnumController, _super);
    function EnumController(scope) {
        _super.call(this, scope);
    }
    Object.defineProperty(EnumController.prototype, "options", {
        get: function () {
            return this.resolvedSchema.enum;
        },
        enumerable: true,
        configurable: true
    });
    EnumController.$inject = ['$scope'];
    return EnumController;
}(abstract_control_1.AbstractControl));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.enum', ['jsonforms.renderers.controls'])
    .directive('enumControl', function () { return new EnumDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('enum-control', testers_1.Testers.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeMatches(function (el) { return _.has(el, 'enum'); })), 5);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('enum.html', enumTemplate);
    }])
    .name;
//# sourceMappingURL=enum.directive.js.map
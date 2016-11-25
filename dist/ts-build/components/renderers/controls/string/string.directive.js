"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var testers_1 = require('../../testers');
var stringTemplate = "<jsonforms-control>\n  <input type=\"text\"\n         id=\"{{vm.id}}\"\n         class=\"form-control jsf-control-string\"\n         ng-model=\"vm.resolvedData[vm.fragment]\"\n         ng-change='vm.triggerChangeEvent()'\n         ng-readonly=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
var StringDirective = (function () {
    function StringDirective() {
        this.restrict = 'E';
        this.templateUrl = 'string.html';
        this.controller = StringController;
        this.controllerAs = 'vm';
    }
    return StringDirective;
}());
var textAreaTemplate = "<jsonforms-control>\n  <textarea id=\"{{vm.id}}\"\n            class=\"form-control jsf-control-string\"\n            ng-model=\"vm.resolvedData[vm.fragment]\"\n            ng-change='vm.triggerChangeEvent()'\n            ng-readonly=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
var StringAreaDirective = (function () {
    function StringAreaDirective() {
        this.restrict = 'E';
        this.templateUrl = 'text-area.html';
        this.controller = StringController;
        this.controllerAs = 'vm';
    }
    return StringAreaDirective;
}());
var StringController = (function (_super) {
    __extends(StringController, _super);
    function StringController(scope) {
        _super.call(this, scope);
    }
    StringController.$inject = ['$scope', 'PathResolver'];
    return StringController;
}(abstract_control_1.AbstractControl));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls'])
    .directive('stringControl', function () { return new StringDirective(); })
    .directive('textAreaControl', function () { return new StringAreaDirective(); })
    .run(['RendererService', function (RendererService) {
        RendererService.register('string-control', testers_1.schemaTypeIs('string'), 1);
        RendererService.register('text-area-control', testers_1.Testers.and(testers_1.schemaTypeIs('string'), testers_1.optionIs('multi', true)), 2);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('string.html', stringTemplate);
        $templateCache.put('text-area.html', textAreaTemplate);
    }])
    .name;
//# sourceMappingURL=string.directive.js.map
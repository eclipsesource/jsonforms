"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('lodash');
var pathutil_1 = require('../../../services/pathutil');
var abstract_control_1 = require('../abstract-control');
var jsonforms_pathresolver_1 = require('../../../services/pathresolver/jsonforms-pathresolver');
var testers_1 = require('../../testers');
var readOnlyArrayTemplate = "\n    <jsonforms-layout>\n      <fieldset>\n        <legend>{{vm.label}}</legend>\n        <div ng-repeat='data in vm.resolvedData[vm.fragment]'>\n            <div ng-repeat='prop in vm.properties'>\n            <strong>{{prop | capitalize}}:</strong> {{data[prop]}}\n            </div>\n            <hr ng-show=\"!$last\">\n        </div>\n       </fieldset>\n     </jsonforms-layout>";
var ArrayReadOnlyDirective = (function () {
    function ArrayReadOnlyDirective() {
        this.restrict = 'E';
        this.templateUrl = 'read-only-array.html';
        this.controller = ArrayController;
        this.controllerAs = 'vm';
    }
    return ArrayReadOnlyDirective;
}());
var arrayTemplate = "\n    <jsonforms-layout>\n        <fieldset ng-disabled=\"vm.uiSchema.readOnly\">\n          <legend>{{vm.label}}</legend>\n          <div>\n            <div ng-repeat=\"d in vm.resolvedData\" ng-if=\"vm.fragment === undefined\">\n                <jsonforms schema=\"vm.arraySchema\" data=\"d\" uischema=\"vm.arrayUiSchema\"></jsonforms>\n            </div>\n            <div ng-repeat=\"d in vm.resolvedData[vm.fragment]\" ng-if=\"vm.fragment !== undefined\">\n                <jsonforms schema=\"vm.arraySchema\" data=\"d\" uischema=\"vm.arrayUiSchema\"></jsonforms>\n            </div>\n            <input class=\"btn btn-primary\"\n                   ng-show=\"vm.supportsSubmit\"\n                   type=\"button\"\n                   value=\"Create {{vm.buttonText}}\"\n                   ng-click=\"vm.submitCallback()\"\n                   ng-model=\"vm.submitElement\">\n            </input>\n        </fieldset>\n    </jsonforms-layout>";
var ArrayDirective = (function () {
    function ArrayDirective() {
        this.restrict = 'E';
        this.templateUrl = 'array.html';
        this.controller = ArrayController;
        this.controllerAs = 'vm';
    }
    return ArrayDirective;
}());
var ArrayController = (function (_super) {
    __extends(ArrayController, _super);
    function ArrayController(scope, uiGenerator) {
        _super.call(this, scope);
        this.submitElement = {};
        var resolvedSubSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(this.schema, this.schemaPath);
        var items = resolvedSubSchema.items;
        this.arraySchema = items;
        this.properties = _.keys(items['properties']);
        this.arrayUiSchema = uiGenerator.generateDefaultUISchema(items, 'HorizontalLayout');
    }
    Object.defineProperty(ArrayController.prototype, "buttonText", {
        get: function () {
            return pathutil_1.PathUtil.beautifiedLastFragment(this.schemaPath);
        },
        enumerable: true,
        configurable: true
    });
    ArrayController.prototype.submitCallback = function () {
        if (this.resolvedData[this.fragment] === undefined) {
            this.resolvedData[this.fragment] = [];
        }
        this.resolvedData[this.fragment].push(_.clone(this.submitElement));
        this.submitElement = {};
    };
    Object.defineProperty(ArrayController.prototype, "supportsSubmit", {
        get: function () {
            var options = this.uiSchema['options'];
            return !(options !== undefined && options['submit'] === false);
        },
        enumerable: true,
        configurable: true
    });
    ArrayController.$inject = ['$scope', 'UISchemaGenerator'];
    return ArrayController;
}(abstract_control_1.AbstractControl));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.array', ['jsonforms.renderers.controls'])
    .directive('arrayReadonlyControl', function () { return new ArrayReadOnlyDirective(); })
    .directive('arrayControl', function () { return new ArrayDirective(); })
    .run(['RendererService', function (RendererService) {
        RendererService.register('array-readonly-control', testers_1.Testers.and(testers_1.schemaTypeIs('array'), testers_1.optionIs('simple', true)), 1);
        RendererService.register('array-control', testers_1.schemaTypeIs('array'), 1);
    }])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('read-only-array.html', readOnlyArrayTemplate);
        $templateCache.put('array.html', arrayTemplate);
    }])
    .name;
//# sourceMappingURL=array-directive.js.map
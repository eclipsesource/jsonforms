var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('lodash');
var pathutil_1 = require('../../../services/pathutil');
var abstract_control_1 = require('../abstract-control');
var jsonforms_pathresolver_1 = require("../../../services/pathresolver/jsonforms-pathresolver");
var ArrayReadOnlyDirective = (function () {
    function ArrayReadOnlyDirective() {
        this.restrict = 'E';
        this.template = "\n    <jsonforms-layout class=\"jsf-group\">\n      <fieldset>\n        <legend>{{vm.label}}</legend>\n        <div ng-repeat='data in vm.resolvedData[vm.fragment]'>\n            <div ng-repeat='prop in vm.properties'>\n            <strong>{{prop | capitalize}}:</strong> {{data[prop]}}\n            </div>\n            <hr ng-show=\"!$last\">\n        </div>\n       </fieldset>\n     </jsonforms-layout>";
        this.controller = ArrayController;
        this.controllerAs = 'vm';
    }
    return ArrayReadOnlyDirective;
})();
var ArrayDirective = (function () {
    function ArrayDirective() {
        this.restrict = 'E';
        this.template = "\n    <jsonforms-layout class=\"jsf-group\">\n        <fieldset ng-disabled=\"vm.uiSchema.readOnly\">\n            <legend>{{vm.label}}</legend>\n            <div ng-repeat=\"d in vm.resolvedData[vm.fragment]\">\n                <jsonforms schema=\"vm.arraySchema\" data=\"d\" uischema=\"vm.arrayUiSchema\"></jsonforms>\n            </div>\n            <fieldset>\n                <legend>Add New Entry</legend>\n                <jsonforms schema=\"vm.arraySchema\" data=\"vm.submitElement\"></jsonforms>\n                <input class=\"btn btn-primary\"\n                      ng-show=\"vm.supportsSubmit\"\n                      type=\"button\"\n                      value=\"Add to {{vm.buttonText}}\"\n                      ng-click=\"vm.submitCallback()\"\n                      ng-model=\"vm.submitElement\">\n                </input>\n            </fieldset>\n        </fieldset>\n    </jsonforms-layout>";
        this.controller = ArrayController;
        this.controllerAs = 'vm';
    }
    return ArrayDirective;
})();
var ArrayController = (function (_super) {
    __extends(ArrayController, _super);
    function ArrayController(scope, uiGenerator) {
        _super.call(this, scope);
        this.submitElement = {};
        var resolvedSubSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(this.schema, this.schemaPath);
        var items = resolvedSubSchema.items;
        this.arraySchema = items;
        this.properties = _.keys(items['properties']);
        this.arrayUiSchema = uiGenerator.generateDefaultUISchema(items, 'Group');
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
})(abstract_control_1.AbstractControl);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.array', ['jsonforms.renderers.controls'])
    .directive('arrayReadonlyControl', function () { return new ArrayReadOnlyDirective(); })
    .directive('arrayControl', function () { return new ArrayDirective(); })
    .run(['RendererService', function (RendererService) {
        RendererService.register('array-readonly-control', abstract_control_1.Testers.and(abstract_control_1.schemaTypeIs('array'), abstract_control_1.optionIs('simple', true)), 1);
        RendererService.register('array-control', abstract_control_1.schemaTypeIs('array'), 1);
    }
])
    .name;
//# sourceMappingURL=array-directive.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var jsonforms_pathresolver_1 = require("../../../services/pathresolver/jsonforms-pathresolver");
var EnumDirective = (function () {
    function EnumDirective() {
        this.restrict = 'E';
        this.template = "<jsonforms-control>\n      <select ng-options=\"option as option for option in vm.options\"\n              id=\"{{vm.id}}\"\n              class=\"form-control jsf-control-enum\" \n              ng-change='vm.modelChanged()'\n              ng-model=\"vm.modelValue[vm.fragment]\"\n              ng-readonly=\"vm.uiSchema.readOnly\">\n      </select>\n    </jsonforms-control>";
        this.controller = EnumController;
        this.controllerAs = 'vm';
    }
    return EnumDirective;
})();
var EnumController = (function (_super) {
    __extends(EnumController, _super);
    function EnumController(scope) {
        _super.call(this, scope);
        this.subSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(this.schema, this.uiSchema['scope']['$ref']);
    }
    Object.defineProperty(EnumController.prototype, "options", {
        get: function () {
            return this.subSchema.enum;
        },
        enumerable: true,
        configurable: true
    });
    EnumController.$inject = ['$scope', 'PathResolver'];
    return EnumController;
})(abstract_control_1.AbstractControl);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.enum', ['jsonforms.renderers.controls'])
    .directive('enumControl', function () { return new EnumDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('enum-control', abstract_control_1.Testers.and(abstract_control_1.uiTypeIs('Control'), abstract_control_1.schemaTypeMatches(function (el) { return _.has(el, 'enum'); })), 5);
    }
])
    .name;
//# sourceMappingURL=enum-directive.js.map
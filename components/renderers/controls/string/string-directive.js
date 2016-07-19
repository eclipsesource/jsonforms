var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var StringDirective = (function () {
    function StringDirective() {
        this.restrict = 'E';
        this.template = "\n    <jsonforms-control>\n       <input type=\"text\" \n              id=\"{{vm.id}}\" \n              class=\"form-control jsf-control-string\" \n              ng-model=\"vm.modelValue[vm.fragment]\" \n              ng-change='vm.modelChanged()' \n              ng-readonly=\"vm.uiSchema.readOnly\"/>\n    </jsonforms-control>";
        this.controller = StringController;
        this.controllerAs = 'vm';
    }
    return StringDirective;
})();
var StringAreaDirective = (function () {
    function StringAreaDirective() {
        this.restrict = 'E';
        this.template = "\n    <jsonforms-control>\n       <textarea id=\"{{vm.id}}\" \n                 class=\"form-control jsf-control-string\" \n                 ng-model=\"vm.modelValue[vm.fragment]\" \n                 ng-change='vm.modelChanged()' \n                 ng-readonly=\"vm.uiSchema.readOnly\"/>\n    </jsonforms-control>";
        this.controller = StringController;
        this.controllerAs = 'vm';
    }
    return StringAreaDirective;
})();
var StringController = (function (_super) {
    __extends(StringController, _super);
    function StringController(scope) {
        _super.call(this, scope);
    }
    StringController.$inject = ['$scope', 'PathResolver'];
    return StringController;
})(abstract_control_1.AbstractControl);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls'])
    .directive('stringControl', function () { return new StringDirective(); })
    .directive('textAreaControl', function () { return new StringAreaDirective(); })
    .run(['RendererService', function (RendererService) {
        RendererService.register('string-control', abstract_control_1.schemaTypeIs('string'), 1);
        RendererService.register('text-area-control', abstract_control_1.Testers.and(abstract_control_1.schemaTypeIs('string'), abstract_control_1.optionIs('multi', true)), 2);
    }
])
    .name;
//# sourceMappingURL=string-directive.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var renderer_service_1 = require('../../renderer-service');
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
    function StringController(scope, pathResolver) {
        _super.call(this, scope, pathResolver);
    }
    StringController.$inject = ['$scope', 'PathResolver'];
    return StringController;
})(abstract_control_1.AbstractControl);
var StringControlRendererTester = abstract_control_1.ControlRendererTester('string', 1);
var StringAreaControlRendererTester = function (element, dataSchema, dataObject, pathResolver) {
    var specificity = abstract_control_1.ControlRendererTester('string', 1)(element, dataSchema, dataObject, pathResolver);
    if (specificity === renderer_service_1.NOT_FITTING) {
        return renderer_service_1.NOT_FITTING;
    }
    if (element['options'] != null && element['options']['multi']) {
        return 2;
    }
    return renderer_service_1.NOT_FITTING;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls'])
    .directive('stringControl', function () { return new StringDirective(); })
    .directive('textAreaControl', function () { return new StringAreaDirective(); })
    .run(['RendererService', function (RendererService) {
        RendererService.register('string-control', StringControlRendererTester);
        RendererService.register('text-area-control', StringAreaControlRendererTester);
    }
])
    .name;
//# sourceMappingURL=string-directive.js.map
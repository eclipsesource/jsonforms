var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var NumberDirective = (function () {
    function NumberDirective() {
        this.restrict = 'E';
        this.template = "\n    <jsonforms-control>\n      <input type=\"number\" \n             step=\"0.01\" \n             id=\"{{vm.id}}\" \n             class=\"form-control jsf-control-number\" \n             ng-model=\"vm.modelValue[vm.fragment]\" \n             ng-change='vm.modelChanged()' \n             ng-readonly=\"vm.uiSchema.readOnly\"/>\n    </jsonforms-control>";
        this.controller = NumberController;
        this.controllerAs = 'vm';
    }
    return NumberDirective;
})();
var NumberController = (function (_super) {
    __extends(NumberController, _super);
    function NumberController(scope, pathResolver) {
        _super.call(this, scope, pathResolver);
    }
    NumberController.$inject = ['$scope', 'PathResolver'];
    return NumberController;
})(abstract_control_1.AbstractControl);
var NumberControlRendererTester = abstract_control_1.ControlRendererTester('number', 1);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.number', ['jsonforms.renderers.controls'])
    .directive('numberControl', function () { return new NumberDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('number-control', NumberControlRendererTester);
    }
])
    .name;
//# sourceMappingURL=number-directive.js.map
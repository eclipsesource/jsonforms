var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var renderer_service_1 = require('../../renderer-service');
var abstract_control_1 = require('../abstract-control');
var DateTimeDirective = (function () {
    function DateTimeDirective() {
        this.restrict = 'E';
        this.templateUrl = 'datetime.html';
        this.controller = DateTimeController;
        this.controllerAs = 'vm';
    }
    return DateTimeDirective;
})();
var DateTimeController = (function (_super) {
    __extends(DateTimeController, _super);
    function DateTimeController(scope, pathResolver) {
        var _this = this;
        _super.call(this, scope, pathResolver);
        var value = this.modelValue[this.fragment];
        if (value) {
            this.dt = new Date(value);
        }
        scope.$watch('vm.modelValue[vm.fragment]', function (newValue) { _this.updateDateObject(); });
    }
    DateTimeController.prototype.modelChanged = function () {
        if (this.dt != null) {
            this.modelValue[this.fragment] = this.dt.toISOString().substr(0, 10);
        }
        else {
            this.modelValue[this.fragment] = null;
        }
        _super.prototype.modelChanged.call(this);
    };
    DateTimeController.prototype.updateDateObject = function () {
        this.dt = new Date(this.modelValue[this.fragment]);
    };
    DateTimeController.$inject = ['$scope', 'PathResolver'];
    return DateTimeController;
})(abstract_control_1.AbstractControl);
exports.DateTimeController = DateTimeController;
var DateTimeControlRendererTester = function (element, dataSchema, dataObject, pathResolver) {
    if (element.type !== 'Control') {
        return renderer_service_1.NOT_FITTING;
    }
    var currentDataSchema = pathResolver.resolveSchema(dataSchema, element['scope']['$ref']);
    if (currentDataSchema !== undefined && currentDataSchema.type === 'string' &&
        currentDataSchema['format'] !== undefined && currentDataSchema['format'] === 'date-time') {
        return 5;
    }
    return renderer_service_1.NOT_FITTING;
};
var datetimeTemplate = "<jsonforms-control>\n      <input type=\"date\"\n             close-text=\"Close\"\n             is-open=\"vm.isOpen\"\n             id=\"{{vm.id}}\"\n             class=\"form-control jsf-control-datetime\"\n             ng-change='vm.modelChanged()'\n             ng-model=\"vm.dt\"\n             ng-model-options=\"{timezone:'UTC'}\"\n             ng-readonly=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls'])
    .directive('datetimeControl', function () { return new DateTimeDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('datetime-control', DateTimeControlRendererTester);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;
//# sourceMappingURL=datetime-directive.js.map
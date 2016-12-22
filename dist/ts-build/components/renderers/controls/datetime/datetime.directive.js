"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var testers_1 = require('../../testers');
var DateTimeDirective = (function () {
    function DateTimeDirective() {
        this.restrict = 'E';
        this.templateUrl = 'datetime.html';
        this.controller = DateTimeController;
        this.controllerAs = 'vm';
    }
    return DateTimeDirective;
}());
var DateTimeController = (function (_super) {
    __extends(DateTimeController, _super);
    function DateTimeController(scope) {
        var _this = this;
        _super.call(this, scope);
        var value = this.resolvedData[this.fragment];
        if (value) {
            this.dt = new Date(value);
        }
        scope.$watch('vm.resolvedData[vm.fragment]', function (newValue) { _this.updateDateObject(); });
    }
    DateTimeController.prototype.triggerChangeEvent = function () {
        if (this.dt != null) {
            this.resolvedData[this.fragment] = this.dt.toISOString().substr(0, 10);
        }
        else {
            this.resolvedData[this.fragment] = null;
        }
        _super.prototype.triggerChangeEvent.call(this);
    };
    DateTimeController.prototype.updateDateObject = function () {
        this.dt = new Date(this.resolvedData[this.fragment]);
    };
    DateTimeController.$inject = ['$scope'];
    return DateTimeController;
}(abstract_control_1.AbstractControl));
exports.DateTimeController = DateTimeController;
var datetimeTemplate = "<jsonforms-control>\n      <input type=\"date\"\n             close-text=\"Close\"\n             is-open=\"vm.isOpen\"\n             id=\"{{vm.id}}\"\n             class=\"form-control jsf-control-datetime\"\n             ng-change='vm.triggerChangeEvent()'\n             ng-model=\"vm.dt\"\n             ng-readonly=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls'])
    .directive('datetimeControl', function () { return new DateTimeDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('datetime-control', testers_1.Testers.and(testers_1.schemaTypeIs('string'), testers_1.schemaTypeMatches(function (el) { return _.has(el, 'format') && el['format'] === 'date'; })), 2);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;
//# sourceMappingURL=datetime.directive.js.map
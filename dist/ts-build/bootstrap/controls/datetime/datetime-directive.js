var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var datetime_directive_1 = require('../../../src/components/renderers/controls/datetime/datetime-directive');
var testers_1 = require('../../../src/components/renderers/testers');
var DateTimeDirective = (function () {
    function DateTimeDirective() {
        this.restrict = 'E';
        this.templateUrl = 'datetimeBootstrap.html';
        this.controller = DateTimeBootstrapController;
        this.controllerAs = 'vm';
    }
    return DateTimeDirective;
})();
var DateTimeBootstrapController = (function (_super) {
    __extends(DateTimeBootstrapController, _super);
    function DateTimeBootstrapController(scope) {
        _super.call(this, scope);
        this.isOpen = false;
    }
    DateTimeBootstrapController.prototype.openDate = function () {
        this.isOpen = true;
        if (this.dt == null) {
            this.dt = new Date();
            this.triggerChangeEvent();
        }
    };
    DateTimeBootstrapController.prototype.updateDateObject = function () {
        var value = this.resolvedData[this.fragment];
        if (value) {
            this.dt = new Date(value);
        }
        else {
            this.dt = null;
        }
    };
    DateTimeBootstrapController.$inject = ['$scope', 'PathResolver'];
    return DateTimeBootstrapController;
})(datetime_directive_1.DateTimeController);
var datetimeTemplate = "<jsonforms-control>\n    <div class=\"input-group\">\n      <input type=\"text\"\n             uib-datepicker-popup=\"dd.MM.yyyy\"\n             close-text=\"Close\"\n             is-open=\"vm.isOpen\"\n             id=\"{{vm.id}}\"\n             class=\"form-control jsf-control-datetime\"\n             ng-change='vm.triggerChangeEvent()'\n             ng-model=\"vm.dt\"\n             ng-model-options=\"{timezone:'UTC'}\"\n             ng-readonly=\"vm.uiSchema.readOnly\"/>\n         <span class=\"input-group-btn\">\n           <button type=\"button\" class=\"btn btn-default\" ng-click=\"vm.openDate()\">\n             <i class=\"glyphicon glyphicon-calendar\"></i>\n           </button>\n         </span>\n    </div>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.controls.datetime', ['jsonforms-bootstrap.renderers.controls'])
    .directive('datetimeBootstrapControl', function () { return new DateTimeDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('datetime-bootstrap-control', testers_1.Testers.and(testers_1.schemaTypeIs('string'), testers_1.schemaTypeMatches(function (el) { return _.has(el, 'format') && el['format'] === 'date-time'; })), 10);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('datetimeBootstrap.html', datetimeTemplate);
    }])
    .name;
//# sourceMappingURL=datetime-directive.js.map
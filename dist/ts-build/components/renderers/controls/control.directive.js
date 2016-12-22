"use strict";
var controlTemplate = "<div class=\"jsf-control form-group\" ng-class=\"vm.alerts.length > 0 ? 'has-error' : ''\"\" ng-hide=\"vm.hide\">\n    <label ng-if=\"vm.showLabel\" for=\"{{vm.id}}\" class=\"control-label\">{{vm.label}}</label>\n    <div style=\"display:flex;\" ng-transclude></div>\n    <alert ng-repeat=\"alert in vm.alerts\" type=\"{{alert.type}}\" class=\"jsf-alert\">{{alert.msg}}</alert>\n</div>";
var ControlDirective = (function () {
    function ControlDirective() {
        this.restrict = 'E';
        this.transclude = true;
        this.templateUrl = 'control.html';
    }
    return ControlDirective;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers'])
    .directive('jsonformsControl', function () { return new ControlDirective; })
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;
//# sourceMappingURL=control.directive.js.map
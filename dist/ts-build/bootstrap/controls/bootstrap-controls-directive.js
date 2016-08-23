var controlTemplate = "\n <script id=\"validation.html\" type=\"text/ng-template\">\n   <div>\n     <alert ng-repeat=\"alert in vm.alerts\" type=\"{{alert.type}}\">{{alert.msg}}</alert>\n   </div>\n </script>\n\n<div class=\"jsf-control form-group top-buffer has-feedback\" ng-class=\"vm.alerts.length > 0 ? 'has-error' : ''\"\" ng-hide=\"vm.hide\">\n    <label ng-if=\"vm.showLabel\" for=\"{{vm.id}}\">{{vm.label}}</label>\n    <div ng-transclude \n         uib-popover-template=\"'validation.html'\" \n         popover-enable=\"vm.alerts.length > 0\" \n         popover-trigger=\"mouseenter\" \n         popover-title=\"Invalid value\" \n         popover-placement=\"bottom-left\"\n         aria-describedby=\"inputError2Status\">\n    </div>\n     <span ng-if=\"vm.alerts.length > 0\" class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\"></span>\n     <span id=\"inputError2Status\" class=\"sr-only\">(error)</span>\n</div>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.controls', ['jsonforms-bootstrap'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;
//# sourceMappingURL=bootstrap-controls-directive.js.map
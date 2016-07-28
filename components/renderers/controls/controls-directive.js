var controlTemplate = "<div class=\"jsf-control\" ng-hide=\"vm.hide\">\n    <div>\n        <label ng-if=\"vm.showLabel\" for=\"{{vm.id}}\">{{vm.label}}</label>\n    </div>\n    <div style=\"display:flex;\" ng-transclude>\n    </div>\n    <div>\n        <alert ng-repeat=\"alert in vm.alerts\" type=\"{{alert.type}}\" >{{alert.msg}}</alert>\n    </div>\n</div>";
var ControlDirective = (function () {
    function ControlDirective() {
        this.restrict = 'E';
        this.transclude = true;
        this.templateUrl = 'control.html';
    }
    return ControlDirective;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers'])
    .directive('jsonformsControl', function () { return new ControlDirective; })
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;
//# sourceMappingURL=controls-directive.js.map
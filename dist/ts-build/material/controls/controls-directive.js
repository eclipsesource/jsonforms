var controlTemplate = "<md-input-container flex>\n  <label ng-if=\"vm.showLabel\" for=\"{{vm.id}}\">{{vm.label}}</label>\n  <ng-transclude></ng-transclude>\n  <div ng-messages=\"{{vm.label}}.$error\" role=\"alert\">\n    <div ng-repeat=\"errorMessage in vm.alerts\">\n      <!-- use ng-message-exp for a message whose key is given by an expression -->\n      <div>{{errorMessage.msg}}</div>\n    </div>\n  </div>\n</md-input-container>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.controls', ['jsonforms.renderers'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;
//# sourceMappingURL=controls-directive.js.map
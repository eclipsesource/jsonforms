var datetimeTemplate = "\n<md-input-container flex class=\"material-jsf-input-container\">\n  <label ng-if=\"vm.label\" for=\"{{vm.id}}\">{{vm.label}}</label>\n  <md-datepicker md-placeholder=\"{{vm.label}}\"\n                aria-label=\"{{vm.label}}\"\n                 ng-model=\"vm.dt\"\n                 ng-change=\"vm.triggerChangeEvent()\"\n                 ng-disabled=\"vm.uiSchema.readOnly\">\n  </md-datepicker>\n  <div ng-messages=\"{{vm.label}}.$error\" role=\"alert\">\n    <div ng-repeat=\"errorMessage in vm.alerts\">\n      <!-- use ng-message-exp for a message whose key is given by an expression -->\n      <div>{{errorMessage.msg}}</div>\n    </div>\n  </div>\n</md-input-container>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.controls.datetime', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;
//# sourceMappingURL=datetime-renderer.js.map
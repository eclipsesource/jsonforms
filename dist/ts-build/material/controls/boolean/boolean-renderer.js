var booleanTemplate = "<md-input-container flex>\n    <md-checkbox class=\"md-primary\"\n                 aria-label=\"{{vm.label}}\"\n                 ng-model=\"vm.resolvedData[vm.fragment]\"\n                 ng-change='vm.triggerChangeEvent()'\n                 ng-disabled=\"vm.uiSchema.readOnly\"/>\n                 {{vm.label}}\n    </md-checkbox>\n    <div ng-messages=\"{{vm.label}}.$error\" role=\"alert\">\n      <div ng-repeat=\"errorMessage in vm.alerts\">\n        <!-- use ng-message-exp for a message whose key is given by an expression -->\n        <div>{{errorMessage.msg}}</div>\n      </div>\n  </div>\n</md-input-container>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.controls.boolean', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('boolean.html', booleanTemplate);
    }])
    .name;
//# sourceMappingURL=boolean-renderer.js.map
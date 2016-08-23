var arrayTemplate = "\n<jsonforms-layout>\n  <fieldset ng-disabled=\"vm.uiSchema.readOnly\">\n  <legend>{{vm.label}}</legend>\n  <div>\n    <div ng-repeat=\"d in vm.resolvedData\" ng-if=\"vm.fragment === undefined\" class=\"well well-sm\">\n      <jsonforms schema=\"vm.arraySchema\" data=\"d\" uischema=\"vm.arrayUiSchema\"></jsonforms>\n    </div>\n    <div ng-repeat=\"d in vm.resolvedData[vm.fragment]\" ng-if=\"vm.fragment !== undefined\" class=\"well well-sm\">\n      <jsonforms schema=\"vm.arraySchema\" data=\"d\" uischema=\"vm.arrayUiSchema\"></jsonforms>\n    </div>\n    <input class=\"btn btn-primary\"\n           ng-show=\"vm.supportsSubmit\"\n           type=\"button\"\n           value=\"Create {{vm.buttonText}}\"\n           ng-click=\"vm.submitCallback()\"\n           ng-model=\"vm.submitElement\">\n    </input>\n  </fieldset>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.controls.array', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('array.html', arrayTemplate);
    }]).name;
//# sourceMappingURL=array-directive.js.map
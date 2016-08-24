var integerTemplate = "<jsonforms-control>\n  <input type=\"number\" \n         step=\"1\" \n         aria-label=\"{{element.label}}\"\n         ng-model=\"vm.resolvedData[vm.fragment]\"\n         ng-change='vm.triggerChangeEvent()'\n         ng-disabled=\"vm.uiSchema.readOnly\" />\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.controls.integer', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('integer.html', integerTemplate);
    }])
    .name;
//# sourceMappingURL=integer-renderer.js.map
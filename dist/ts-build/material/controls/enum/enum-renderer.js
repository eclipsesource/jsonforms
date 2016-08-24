var enumTemplate = "<jsonforms-control>\n      <md-select aria-label=\"{{vm.label}}\"\n                 ng-change='vm.triggerChangeEvent()'\n                 ng-model=\"vm.resolvedData[vm.fragment]\"\n                 ng-readonly=\"vm.uiSchema.readOnly\">\n        <md-option ng-repeat=\"option in vm.options\" ng-value=\"option\">\n          {{option}}\n        </md-option>           \n      </md-select>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.controls.enum', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('enum.html', enumTemplate);
    }])
    .name;
//# sourceMappingURL=enum-renderer.js.map
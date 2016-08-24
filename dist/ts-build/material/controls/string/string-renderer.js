var stringTemplate = "<jsonforms-control>\n  <input type=\"text\" \n         id=\"{{vm.id}}\" \n         aria-label=\"{{element.label}}\" \n         ng-model=\"vm.resolvedData[vm.fragment]\"\n         ng-change='vm.triggerChangeEvent()'\n         ng-disabled=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.controls.string', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('string.html', stringTemplate);
    }])
    .name;
//# sourceMappingURL=string-renderer.js.map
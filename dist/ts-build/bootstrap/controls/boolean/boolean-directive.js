var booleanTemplate = "<jsonforms-control>\n  <input type=\"checkbox\"\n         id=\"{{vm.id}}\"\n         class=\"jsf-control-boolean\"\n         ng-model=\"vm.resolvedData[vm.fragment]\"\n         ng-change='vm.triggerChangeEvent()'\n         ng-disabled=\"vm.uiSchema.readOnly\"/>\n</jsonforms-control>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.controls.boolean', ['jsonforms-bootstrap.renderers.controls'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('boolean.html', booleanTemplate);
    }])
    .name;
//# sourceMappingURL=boolean-directive.js.map
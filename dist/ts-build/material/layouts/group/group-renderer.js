var groupTemplate = "<jsonforms-layout>\n    <div layout-padding layout=\"column\" class=\"jsf-group\">\n        <fieldset>\n            <legend ng-if=\"vm.label\">{{vm.label}}</legend>\n            <jsonforms-inner ng-repeat=\"child in vm.uiSchema.elements\"\n                             uischema=\"child\">\n            </jsonforms-inner>\n         </fieldset>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.layouts.group', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('group.html', groupTemplate);
    }])
    .name;
//# sourceMappingURL=group-renderer.js.map
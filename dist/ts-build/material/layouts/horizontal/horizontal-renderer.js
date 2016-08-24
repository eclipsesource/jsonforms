var horizontalTemplate = "<jsonforms-layout>\n    <div layout-padding layout=\"row\" layout-sm=\"column\" class=\"jsf-horizontal-layout-container\">\n        <div flex ng-repeat=\"child in vm.uiSchema.elements\">\n             <jsonforms-inner uischema=\"child\"></jsonforms-inner>\n        </div>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.layouts.horizontal', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;
//# sourceMappingURL=horizontal-renderer.js.map
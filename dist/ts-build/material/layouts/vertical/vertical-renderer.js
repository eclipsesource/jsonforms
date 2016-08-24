var verticalTemplate = "\n<jsonforms-layout>\n  <div layout-padding layout=\"column\" class=\"jsf-vertical-layout\">\n    <div class=\"jsf-vertical-layout-container\">        \n      <div ng-repeat=\"child in vm.uiSchema.elements\">\n        <jsonforms-inner uischema=\"child\"></jsonforms-inner>\n      </div>\n    </div>\n  </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.layouts.vertical', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;
//# sourceMappingURL=vertical-renderer.js.map
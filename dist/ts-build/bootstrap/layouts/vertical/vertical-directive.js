var verticalTemplate = "\n<jsonforms-layout>\n    <div class=\"jsf-vertical-layout\">\n        <div class=\"row\">\n            <jsonforms-inner ng-repeat=\"child in vm.uiSchema.elements\"\n                             uischema=\"child\"\n                             class=\"col-sm-100\">\n            </jsonforms-inner>\n        </div>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.layouts.vertical', ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;
//# sourceMappingURL=vertical-directive.js.map
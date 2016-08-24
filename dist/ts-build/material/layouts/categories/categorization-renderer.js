var categorizationTemplate = "<jsonforms-layout>\n            <md-tabs md-border-bottom md-dynamic-height md-autoselect>\n                <md-tab ng-repeat=\"child in vm.uiSchema.elements\" label=\"{{child.label}}\">\n                    <jsonforms-layout>\n                        <fieldset>\n                            <md-content layout-padding layout=\"column\">\n                                <jsonforms-inner ng-repeat=\"innerchild in child.elements\" uischema=\"innerchild\"></jsonforms-inner>\n                            </md-content>\n                        </fieldset>\n                    </jsonforms-layout>\n                </md-tab>\n            </md-tabs>\n        </jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.layouts.categories', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;
//# sourceMappingURL=categorization-renderer.js.map
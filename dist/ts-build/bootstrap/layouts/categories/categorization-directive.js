var categorizationTemplate = "<jsonforms-layout>        \n     <div class=\"row jsf-categorization\">\n          <div class=\"col-sm-100\">\n               <uib-tabset>\n                    <uib-tab\n                        heading=\"{{category.label}}\"\n                        ng-repeat=\"category in vm.uiSchema.elements\"\n                        select=\"vm.changeSelectedCategory(category)\">\n                        <fieldset ng-if=\"vm.selectedCategory===category\">\n                            <jsonforms-inner ng-repeat=\"child in category.elements\"\n                                             uischema=\"child\" >\n                            </jsonforms-inner>\n                        </fieldset>\n                    </uib-tab>\n               </uib-tabset>\n           </div>\n     </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.layouts.categories', ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;
//# sourceMappingURL=categorization-directive.js.map
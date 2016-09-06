const categorizationTemplate = `<jsonforms-layout>        
     <div class="row jsf-categorization">
          <div class="col-sm-100">
               <uib-tabset>
                    <uib-tab
                        heading="{{category.label}}"
                        ng-repeat="category in vm.uiSchema.elements"
                        select="vm.changeSelectedCategory(category)">
                        <fieldset ng-if="vm.selectedCategory===category">
                            <jsonforms-inner ng-repeat="child in category.elements"
                                             uischema="child" >
                            </jsonforms-inner>
                        </fieldset>
                    </uib-tab>
               </uib-tabset>
           </div>
     </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-bootstrap.renderers.layouts.categories',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;

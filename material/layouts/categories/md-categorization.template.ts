const categorizationTemplate = `
<script type="text/ng-template" id="category.html">
  <md-tabs md-border-bottom md-dynamic-height md-autoselect>
    <md-tab ng-repeat="category in categorization.elements" label="{{category.label}}">
      <div class="jsf-category-subcategories" ng-init="categorization=category"
        ng-if="category.type==='Categorization'" ng-include="'category.html'">
      </div>
      <jsonforms-layout ng-if="category.type==='Category'">
        <fieldset>
          <md-content layout-padding layout="column">
            <jsonforms-inner ng-repeat="innerchild in category.elements" uischema="innerchild">
            </jsonforms-inner>
          </md-content>
        </fieldset>
      </jsonforms-layout>
    </md-tab>
  </md-tabs>
</script>
<jsonforms-layout>
  <div class="jsf-categorization">
    <div class="jsf-categorization-master" ng-include="'category.html'"
      ng-init="categorization=vm.uiSchema">
    </div>
  </div>
</jsonforms-layout>`;
export default angular.module('jsonforms-material.renderers.layouts.categories', [])
  .run(['$templateCache', $templateCache => {
      $templateCache.put('categorization.html', categorizationTemplate);
  }])
  .name;

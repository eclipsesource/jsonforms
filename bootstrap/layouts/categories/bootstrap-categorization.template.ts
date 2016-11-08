const categorizationTemplate = `
<script type="text/ng-template" id="category.html">
  <uib-tabset>
    <uib-tab ng-repeat="category in categorization.elements" heading="{{category.label}}">
      <div class="jsf-category-subcategories" ng-init="categorization=category"
        ng-if="category.type==='Categorization'" ng-include="'category.html'">
      </div>
      <fieldset ng-if="category.type==='Category'">
          <jsonforms-inner ng-repeat="child in category.elements" uischema="child">
          </jsonforms-inner>
      </fieldset>
    </uib-tab>
  </uib-tabset>
</script>
<jsonforms-layout>
  <div class="jsf-categorization">
    <div class="jsf-categorization-master" ng-include="'category.html'"
      ng-init="categorization=vm.uiSchema">
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

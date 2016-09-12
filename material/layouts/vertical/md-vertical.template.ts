const verticalTemplate = `
<jsonforms-layout>
  <div layout-padding layout="column" class="jsf-vertical-layout">
    <div class="jsf-vertical-layout-container">        
      <div ng-repeat="child in vm.uiSchema.elements">
        <jsonforms-inner uischema="child"></jsonforms-inner>
      </div>
    </div>
  </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-material.renderers.layouts.vertical', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;

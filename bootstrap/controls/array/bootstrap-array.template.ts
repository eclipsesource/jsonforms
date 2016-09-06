const arrayTemplate =  `
<jsonforms-layout>
  <fieldset ng-disabled="vm.uiSchema.readOnly">
  <legend>{{vm.label}}</legend>
  <div>
    <div ng-repeat="d in vm.resolvedData" ng-if="vm.fragment === undefined" class="well well-sm">
      <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
    </div>
    <div ng-repeat="d in vm.resolvedData[vm.fragment]" ng-if="vm.fragment !== undefined" class="well well-sm">
      <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
    </div>
    <input class="btn btn-primary"
           ng-show="vm.supportsSubmit"
           type="button"
           value="Create {{vm.buttonText}}"
           ng-click="vm.submitCallback()"
           ng-model="vm.submitElement">
    </input>
  </fieldset>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-bootstrap.renderers.controls.array', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('array.html', arrayTemplate);
    }]).name;

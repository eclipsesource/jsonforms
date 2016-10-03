const arrayTemplate =  `
<jsonforms-layout>
  <fieldset ng-disabled="vm.uiSchema.readOnly">
  <legend>{{vm.label}}</legend>
  <div>
    <div ng-repeat="d in vm.resolvedData" ng-if="vm.fragment === undefined" class="well well-sm">
      <div class="row jsf-control-array-container">
        <div class="col-sm-90 jsf-control-array-element">
          <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
        </div>
        <div class="col-sm-10 jsf-control-array-element-delete">
          <button class="btn btn-default"
               ng-show="vm.supportsDelete"
               ng-click="vm.deleteCallback(d)">
               <span class="glyphicon glyphicon-remove-circle"></span>
          </button>
        </div>
      </div>
    </div>
    <div ng-repeat="d in vm.resolvedData[vm.fragment]"
      ng-if="vm.fragment !== undefined" class="well well-sm">
      <div class="row jsf-control-array-container">
        <div class="col-sm-90 jsf-control-array-element">
          <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
        </div>
        <div class="col-sm-10 jsf-control-array-element-delete">
          <button class="btn btn-default"
               ng-show="vm.supportsDelete"
               ng-click="vm.deleteCallback(d)">
               <span class="glyphicon glyphicon-remove-circle"></span>
          </button>
        </div>
      </div>
    </div>
    <div ng-if="vm.isEmpty" class="array-empty">{{vm.emptyMsg}}</div>
    <input class="btn btn-primary"
           ng-show="vm.supportsSubmit"
           type="button"
           value="Add {{vm.buttonText}}"
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

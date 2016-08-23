const arrayTemplate = `
    <jsonforms-layout>
        <fieldset ng-disabled="vm.uiSchema.readOnly">
          <legend>{{vm.label}}</legend>
          <div>
            <div ng-repeat="d in vm.resolvedData" ng-if="vm.fragment === undefined">
                <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
            </div>
            <div ng-repeat="d in vm.resolvedData[vm.fragment]" ng-if="vm.fragment !== undefined">
                <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
            </div>
            <md-button class="md-raised md-primary"
                   ng-show="vm.supportsSubmit"
                   ng-click="vm.submitCallback()">Create {{vm.buttonText}}
            </md-button>
        </fieldset>
    </jsonforms-layout>`;

export default angular
    .module('jsonforms-material.renderers.controls.array', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('array.html', arrayTemplate);
    }]).name;

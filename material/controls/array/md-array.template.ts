const arrayTemplate = `
    <jsonforms-layout>
        <fieldset ng-disabled="vm.uiSchema.readOnly">
          <legend>{{vm.label}}</legend>
          <div>
            <div ng-repeat="d in vm.resolvedData" ng-if="vm.fragment === undefined">
                <div class="row jsf-control-array-container">
                    <div class="jsf-control-array-element">
                        <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
                    </div>
                    <div class="jsf-control-array-element-delete">
                        <md-button class="md-icon-button"
                               ng-show="vm.supportsDelete"
                               ng-click="vm.deleteCallback(d)">
                               <md-icon md-font-set="material-icons" aria-label="Remove">delete</md-icon>
                        </md-button>
                    </div>
                </div>
            </div>
            <div ng-repeat="d in vm.resolvedData[vm.fragment]" ng-if="vm.fragment !== undefined">
                <div class="row jsf-control-array-container">
                    <div class="jsf-control-array-element">
                        <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
                    </div>
                    <div class="jsf-control-array-element-delete">
                        <md-button class="md-icon-button"
                               ng-show="vm.supportsDelete"
                               ng-click="vm.deleteCallback(d)">
                               <md-icon md-font-set="material-icons" aria-label="Remove">delete</md-icon>
                        </md-button>
                    </div>
                </div>
            </div>
            <div ng-if="vm.isEmpty" class="array-empty">{{vm.emptyMsg}}</div>
            <md-button class="md-raised md-primary"
                   ng-show="vm.supportsSubmit"
                   ng-click="vm.submitCallback()">Add {{vm.buttonText}}
            </md-button>
        </fieldset>
    </jsonforms-layout>`;

export default angular
    .module('jsonforms-material.renderers.controls.array', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('array.html', arrayTemplate);
    }]).name;

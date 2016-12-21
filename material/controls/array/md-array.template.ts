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
                               <svg role="img" aria-label="Delete" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
                                   <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                   <path d="M0 0h24v24H0z" fill="none"/>
                               </svg>
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
                               <svg role="img" aria-label="Delete" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
                                   <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                   <path d="M0 0h24v24H0z" fill="none"/>
                               </svg>
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

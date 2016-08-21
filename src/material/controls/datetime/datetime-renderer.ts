const datetimeTemplate = `
<md-input-container>
  <md-datepicker md-placeholder="{{vm.label}}"
                 ng-model="vm.resolvedData[vm.fragment]"
                 ng-change="vm.triggerChangeEvent()"
                 ng-disabled="vm.uiSchema.readOnly"> 
  </md-datepicker>
  <div ng-messages="{{vm.label}}.$error" role="alert">
    <div ng-repeat="errorMessage in vm.alerts">
      <!-- use ng-message-exp for a message whose key is given by an expression -->
      <div ng-message-exp="errorMessage.type">{{errorMessage.msg}}</div>
    </div>
  </div>
</md-input-container>`;

export default angular
    .module('jsonforms-material.renderers.controls.datetime', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;


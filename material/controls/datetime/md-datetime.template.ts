const datetimeTemplate = `
<md-input-container flex class="material-jsf-input-container">
  <label ng-if="vm.label" for="{{vm.id}}">{{vm.label}}</label>
  <md-datepicker md-placeholder="{{vm.label}}"
                aria-label="{{vm.label}}"
                 ng-model="vm.dt"
                 ng-change="vm.triggerChangeEvent()"
                 ng-disabled="vm.uiSchema.readOnly">
  </md-datepicker>
  <div ng-messages="{{vm.label}}.$error" role="alert">
    <div ng-repeat="errorMessage in vm.alerts">
      <!-- use ng-message-exp for a message whose key is given by an expression -->
      <div>{{errorMessage.msg}}</div>
    </div>
  </div>
</md-input-container>`;

export default angular
    .module('jsonforms-material.renderers.controls.datetime', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;

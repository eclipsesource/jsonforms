const booleanTemplate = `<md-input-container flex>
    <md-checkbox class="md-primary"
                 aria-label="{{vm.label}}"
                 ng-model="vm.resolvedData[vm.fragment]"
                 ng-change='vm.triggerChangeEvent()'
                 ng-disabled="vm.uiSchema.readOnly"/>
                 {{vm.label}}
    </md-checkbox>
    <div ng-messages="{{vm.label}}.$error" role="alert">
      <div ng-repeat="errorMessage in vm.alerts">
        <!-- use ng-message-exp for a message whose key is given by an expression -->
        <div>{{errorMessage.msg}}</div>
      </div>
  </div>
</md-input-container>`;

export default angular
    .module('jsonforms-material.renderers.controls.boolean', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('boolean.html', booleanTemplate);
    }])
    .name;

const datetimeTemplate = `
<md-input-container flex class="material-jsf-input-container">
  <label ng-if="vm.label" for="{{vm.id}}">{{vm.label}}</label>
  <md-datepicker md-placeholder="{{vm.label}}"
                aria-label="{{vm.label}}"
                 ng-model="vm.dt"
                 ng-change="vm.triggerChangeEvent()"
                 ng-disabled="vm.uiSchema.readOnly">
  </md-datepicker>
  
</md-input-container>`;

export default angular
    .module('jsonforms-material.renderers.controls.datetime', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;

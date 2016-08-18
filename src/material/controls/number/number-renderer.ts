const numberTemplate = `<jsonforms-control>
  <input type="number" 
         step="0.01" 
         aria-label="{{element.label}}" 
         ng-model="vm.resolvedData[vm.fragment]"
         ng-change='vm.triggerChangeEvent()'
         ng-disabled="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

export default angular
    .module('jsonforms-material.renderers.controls.number', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('number.html', numberTemplate);
    }])
    .name;

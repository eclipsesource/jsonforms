const integerTemplate = `<jsonforms-control>
  <input type="number" 
         step="1" 
         aria-label="{{element.label}}"
         ng-model="vm.resolvedData[vm.fragment]"
         ng-change='vm.triggerChangeEvent()'
         ng-disabled="vm.uiSchema.readOnly" />
</jsonforms-control>`;

export default angular
    .module('jsonforms-material.renderers.controls.integer', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('integer.html', integerTemplate);
    }])
    .name;
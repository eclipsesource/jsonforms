const stringTemplate = `<jsonforms-control>
  <input type="text" 
         id="{{vm.id}}" 
         aria-label="{{element.label}}" 
         ng-model="vm.resolvedData[vm.fragment]"
         ng-change='vm.triggerChangeEvent()'
         ng-disabled="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

export default angular
    .module('jsonforms-material.renderers.controls.string', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('string.html', stringTemplate);
    }])
    .name;

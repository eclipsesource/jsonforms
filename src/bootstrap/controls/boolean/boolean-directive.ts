const booleanTemplate = `<jsonforms-control>
  <input type="checkbox"
         id="{{vm.id}}"
         class="jsf-control-boolean"
         ng-model="vm.resolvedData[vm.fragment]"
         ng-change='vm.triggerChangeEvent()'
         ng-disabled="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

export default angular
    .module('jsonforms-bootstrap.renderers.controls.boolean',
        ['jsonforms-bootstrap.renderers.controls'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('boolean.html', booleanTemplate);
    }])
    .name;

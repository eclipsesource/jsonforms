const groupTemplate = `<jsonforms-layout>
    <div layout-padding layout="column" class="jsf-group">
        <fieldset>
            <legend ng-if="vm.label">{{vm.label}}</legend>
            <jsonforms-inner ng-repeat="child in vm.uiSchema.elements"
                             uischema="child">
            </jsonforms-inner>
         </fieldset>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-material.renderers.layouts.group', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('group.html', groupTemplate);
    }])
    .name;

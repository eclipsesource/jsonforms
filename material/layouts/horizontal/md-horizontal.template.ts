const horizontalTemplate = `<jsonforms-layout>
    <div layout="row" layout-sm="column" class="jsf-horizontal-layout-container">
        <div flex ng-repeat="child in vm.uiSchema.elements">
             <jsonforms-inner uischema="child"></jsonforms-inner>
        </div>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-material.renderers.layouts.horizontal', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;

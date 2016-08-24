const verticalTemplate = `
<jsonforms-layout>
    <div class="jsf-vertical-layout">
        <div class="row">
            <jsonforms-inner ng-repeat="child in vm.uiSchema.elements"
                             uischema="child"
                             class="col-sm-100">
            </jsonforms-inner>
        </div>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-bootstrap.renderers.layouts.vertical',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;

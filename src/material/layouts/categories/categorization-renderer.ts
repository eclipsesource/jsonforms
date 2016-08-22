const categorizationTemplate = `<jsonforms-layout>
            <md-tabs md-border-bottom md-dynamic-height md-autoselect>
                <md-tab ng-repeat="child in vm.uiSchema.elements" label="{{child.label}}">
                    <jsonforms-layout>
                        <fieldset>
                            <md-content layout-padding layout="column">
                                <jsonforms-inner ng-repeat="innerchild in child.elements" uischema="innerchild"></jsonforms-inner>
                            </md-content>
                        </fieldset>
                    </jsonforms-layout>
                </md-tab>
            </md-tabs>
        </jsonforms-layout>`;
export default angular
    .module('jsonforms-material.renderers.layouts.categories', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;

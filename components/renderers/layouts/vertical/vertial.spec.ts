/// <reference path="../../../references.ts"/>

describe('VerticalLayout', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.vertical'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should not support labels", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "foo": { "type": "string" }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/foo"
                    }
                }
            ]
        };
        scope.data = { "name": "John Doe "};
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let div = el.find('div');
        let layout = angular.element(div.children()[0]);
        expect(layout.hasClass('jsf-vertical-layout')).toBeTruthy();
    }));
});
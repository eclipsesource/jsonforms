/// <reference path="../../../references.ts"/>

describe('String renderer', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.boolean'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should support read-only flag", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string",
                }
            }
        };
        scope.uiSchema = { "type": "Control", "readOnly": true, "scope": { "$ref": "#/properties/name" } };
        scope.data = { "vegetarian": true };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control'));
        expect(input.attr("readonly")).toBeDefined();
    }));
});
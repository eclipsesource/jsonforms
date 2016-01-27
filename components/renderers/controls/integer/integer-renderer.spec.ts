/// <reference path="../../../references.ts"/>

describe('Integer renderer', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.integer'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should support read-only flag", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "age": {
                    "type": "integer"
                }
            }
        };
        scope.uiSchema = { "type": "Control", "readOnly": true, "scope": { "$ref": "#/properties/age" } };
        scope.data = { "age": 30 };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control'));
        expect(input.attr("readonly")).toBeDefined();
    }));
});
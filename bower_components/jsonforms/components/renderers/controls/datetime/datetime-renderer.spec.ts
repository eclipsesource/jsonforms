/// <reference path="../../../references.ts"/>

describe('DateTimeTest', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.masterdetail'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    let schema = {
            "properties": {
                "birthDate": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        };

    it("should be rendered", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = schema;
        scope.uiSchema = { "type": "Control", "scope": { "$ref": "#/properties/birthDate" } };
        scope.data = { "birthDate": new Date() };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("datepicker-popup");
    }));

    it("should support read-only flag", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = schema;
        scope.uiSchema = { "type": "Control", "readOnly": true, "scope": { "$ref": "#/properties/birthDate" } };
        scope.data = { "birthDate": "1985-06-02 20:15:36" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control'));
        expect(input.attr("readonly")).toBeDefined();
    }));
    // TODO: add test cases to check whether validation works
});
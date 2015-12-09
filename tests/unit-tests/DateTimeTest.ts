/// <reference path="../references.ts"/>

describe('DateTimeTest', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.masterdetail'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should be rendered", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "birthDate": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        };
        scope.uiSchema = { "type": "Control", "scope": { "$ref": "#/properties/birthDate" } };
        scope.data = { "birthDate": new Date() };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("datepicker-popup");
    }));

    // TODO: add test cases to check whether validation works
});
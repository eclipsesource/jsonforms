/// <reference path="../references.ts"/>

describe("Path binding for nested properties", () => {

    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.string'));
    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should created nested objects", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "personalData": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        }
                    }
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "scope": {
                "$ref": "#/properties/personalData/properties/name"
            }
        };
        scope.data = { }; // empty data
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var input = el.find('input');
        input.val('John Doe').triggerHandler('input');
        expect(scope.data.personalData).toBeDefined();
    }));
});


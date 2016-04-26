/// <reference path="../references.ts"/>

describe('jsonforms directive', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.pathresolver'));
    beforeEach(module('jsonforms.renderers.extras.label'));
    beforeEach(module('jsonforms.renderers.layouts.vertical'));
    beforeEach(module('jsonforms.renderers.layouts.horizontal'));
    beforeEach(module('jsonforms.renderers.controls.array'));
    beforeEach(module('jsonforms.renderers.controls.integer'));
    beforeEach(module('jsonforms.renderers.controls.boolean'));
    beforeEach(module('jsonforms.renderers.controls.string'));
    beforeEach(module('jsonforms.renderers.controls.number'));
    beforeEach(module('jsonforms.renderers.controls.datetime'));
    beforeEach(module('jsonforms.renderers.controls.enum'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should render a labeled select field", inject(function ($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "type": "object",
            "properties": {
                "gender": {
                    "type": "string",
                    "enum": ["Male", "Female"]
                }
            }
        };
        scope.data = { gender: 'Female'};
        scope.uiSchema = {
            "type": "Control",
            "label": "Gender",
            "scope": { "$ref": "#/properties/gender" }
        };
        var el = $compile('<jsonforms schema="schema" data="data" ui-schema="uiSchema">')(scope);
        scope.$digest();
        // should test for more complex logic here
        expect(el.find("label").text()).toEqual("Gender");
        expect(el.find("select")).toBeDefined();
    }));

    it("should throw an error in case the data attribute is missing", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {};
        scope.uiSchema = {};
        expect(function() {
            $compile('<jsonforms schema="schema" ui-schema="uiSchema"/>')(scope);
            scope.$digest();
        }).toThrow(Error("Either the 'data' or the 'async-data-provider' attribute must be specified."))
    }));

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

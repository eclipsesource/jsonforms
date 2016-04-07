/// <reference path="../../../references.ts"/>

describe('HorizontalLayout', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.horizontal'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should take into account if some labels are hidden", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "foo": { "type": "string" },
                "bar": { "type": "string" }
            }
        };
        scope.uiSchema = {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": true,
                    "scope": { "$ref": "#/properties/foo" }
                },
                {
                    "type": "Control",
                    "label": false,
                    "scope": { "$ref": "#/properties/bar" }
                }
            ]
        };

        scope.data = { "foo": "quux", "bar": "baz" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let labelElements = el.find('label');
        expect(labelElements).toBeDefined();
        // one label is empty
        expect(labelElements.length).toEqual(2);
        expect(angular.element(labelElements[0]).text()).toEqual("Foo");
        expect(angular.element(labelElements[1]).text()).toEqual("");
    }));

    it("should take into account if all labels are hidden", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "foo": { "type": "string" },
                "bar": { "type": "string" }
            }
        };
        scope.uiSchema = {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": {
                        show: false
                    },
                    "scope": { "$ref": "#/properties/foo" }
                },
                {
                    "type": "Control",
                    "label": {
                        show: false
                    },
                    "scope": { "$ref": "#/properties/bar" }
                }
            ]
        };

        scope.data = { "foo": "quux", "bar": "baz" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let labelElements = el.find('label');
        expect(labelElements.length).toBe(0);
    }));
});
/// <reference path="../../../references.ts"/>

describe('LabelElement', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.extras.label'));
    beforeEach(module('components/form/form.html'));

    it("should be rendered", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {}
        };
        scope.uiSchema = { "type": "Label", "text": "My Label" };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("My Label");
    }));


    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.string'));
    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should be generated automatically", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = { "type": "Control", "scope": { "$ref": "#/properties/name" } };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("Name");
    }));

    it("should be able to specify custom label attribute", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": "This is a custom label",
            "scope": { "$ref": "#/properties/name" }
        };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("This is a custom label");
    }));

    it("should be annotated in case the property the control is pointing to is required",
        inject(($rootScope, $compile) => {
            var scope = $rootScope.$new();
            scope.schema = {
                "properties": {
                    "name": {
                        "type": "string"
                    }
                },
                "required": ["name"]
            };
            scope.uiSchema = {
                "type": "Control",
                "scope": { "$ref": "#/properties/name" }
            };
            scope.data = { "name": "John Doe "};
            var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            var label = el.find('label');
            expect(label.text()).toBe("Name*");
        }));
});

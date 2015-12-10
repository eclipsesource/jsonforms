/// <reference path="../../../references.ts"/>

describe('Reference control', () => {

    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.string'));
    beforeEach(module('jsonforms.renderers.controls.reference'));
    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should create a valid href", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": { "type": "string" },
                "someId": { "type": "string" }
            }
        };
        scope.uiSchema =  {
            "type": "ReferenceControl",
            "scope": { "$ref": "#/properties/someId" },
            "href": {
                "url": "/fake"
            }
        };
        scope.data = {
            "name": "John Doe",
            "someId": 3
        };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var a = el.find('a');
        expect(a.attr('href')).toBe('#/fake/3');
        expect(a.text()).toBe('Some id');
    }));

    it("should support customizable via a label properties", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": { "type": "string" },
                "someId": { "type": "string" }
            }
        };
        scope.uiSchema =  {
            "type": "ReferenceControl",
            "scope": { "$ref": "#/properties/someId" },
            "label": "Navigate to ",
            "href": {
                "url": "/fake",
                "label": "Parent"
            }
        };
        scope.data = {
            "name": "John Doe",
            "someId": 3
        };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var a = el.find('a');
        expect(a.text()).toBe('Parent');
        expect(a.parent().html()).toContain('Navigate to');
    }));
});

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>

describe('Labels', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.renderers.controls.string'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/control.html'));

    it("should be generated automatically", inject(function($rootScope, $compile) {
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

    it("should be able to specify custom label attribute", inject(function($rootScope, $compile, UISchemaGenerator) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = { "type": "Control", "label": "This is a custom label", "scope": { "$ref": "#/properties/name" } };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("This is a custom label");
    }));
});

'use strict';

describe('jsonforms directive', function() {

    var el, scope;

    // load all necessary modules and templates
    beforeEach(module('jsonForms.services'));
    beforeEach(module('jsonForms.directives'));
    beforeEach(module('jsonForms.control'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/element.html'));
    beforeEach(module('templates/control.html'));

    beforeEach(inject(function($rootScope, $compile, $q) {
        scope = $rootScope.$new();
        // the jsonforms directive expects functions that return promises
        scope.schema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.data = {
            name: 'John Doe'
        };
        scope.uiSchema = {
            "type": "Control",
            "label": "First name",
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        el = $compile('<jsonforms schema="schema" data="data" ui-schema="uiSchema">')(scope);
        scope.$digest();
    }));

    it("should render a simple input field", inject(function () {
        // simple assert, we should test for more complex logic here
        expect(el.html()).toContain("form");
    }));

});
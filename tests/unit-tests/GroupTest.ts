/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>

describe('Group', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.services'));
    beforeEach(module('jsonforms.directives'));
    beforeEach(module('jsonforms.verticalLayout'));
    beforeEach(module('jsonforms.stringControl'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/layout.html'));
    beforeEach(module('templates/control.html'));

    it("should support labels", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "foo": { "type": "string" }
            }
        };
        scope.uiSchema = {
            "type": "Group",
            "label": "woot",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/foo"
                    }
                }
            ]
        };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var div = el.find('div');
        expect(div.hasClass('jsf-group')).toBeTruthy();
    }));
});

describe('VerticalLayout', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.services'));
    beforeEach(module('jsonforms.directives'));
    beforeEach(module('jsonforms.verticalLayout'));
    beforeEach(module('jsonforms.stringControl'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/layout.html'));
    beforeEach(module('templates/control.html'));

    it("should not support labels", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "foo": { "type": "string" }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "label": "woot",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/foo"
                    }
                }
            ]
        };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        var div = el.find('div');
        expect(div.hasClass('jsf-group')).toBeFalsy();
    }));
});


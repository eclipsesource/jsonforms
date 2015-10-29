/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>

describe("Path binding for nested properties", () => {

    beforeEach(module('jsonforms.services'));
    beforeEach(module('jsonforms.directives'));
    beforeEach(module('jsonforms.stringControl'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/control.html'));

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


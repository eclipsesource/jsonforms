import "angular"
import "angular-mocks"
import "../../index"

describe('jsonforms directive', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it("should render a labeled select field", inject(function ($rootScope, $compile) {
        let scope = $rootScope.$new();
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
        let el = $compile('<jsonforms schema="schema" data="data" ui-schema="uiSchema">')(scope);
        scope.$digest();
        // should test for more complex logic here
        expect(el.find("label").text()).toEqual("Gender");
        expect(el.find("select")).toBeDefined();
    }));

    it("should throw an error in case the data attribute is missing", inject(function($rootScope, $compile) {
        let scope = $rootScope.$new();
        scope.schema = {};
        scope.uiSchema = {};
        expect(function() {
            $compile('<jsonforms schema="schema" ui-schema="uiSchema"/>')(scope);
            scope.$digest();
        }).toThrow(Error("The 'data' attribute must be specified."))
    }));

    it("should created nested objects", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
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
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = el.find('input');
        input.val('John Doe').triggerHandler('input');
        expect(scope.data.personalData).toBeDefined();
    }));
});

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>

describe('jsonforms directive', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.services'));
    beforeEach(module('jsonforms.directives'));
    beforeEach(module('jsonforms.label'));
    beforeEach(module('jsonforms.verticalLayout'));
    beforeEach(module('jsonforms.horizontalLayout'));
    beforeEach(module('jsonforms.arrayControl'));
    beforeEach(module('jsonforms.integerControl'));
    beforeEach(module('jsonforms.booleanControl'));
    beforeEach(module('jsonforms.stringControl'));
    beforeEach(module('jsonforms.numberControl'));
    beforeEach(module('jsonforms.datetimeControl'));
    beforeEach(module('jsonforms.enumControl'));

    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/control.html'));
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

    it("should throw an error in case both data attributes are present", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {};
        scope.uiSchema = {};
        scope.data = {};
        scope.dataProvider = {};
        expect(function() {
            $compile('<jsonforms data="data" async-data-provider="dataProvider" schema="schema" ui-schema="uiSchema"/>')(scope);
            scope.$digest();
        }).toThrow(Error("You cannot specify both the 'data' and the 'async-data-provider' attribute at the same time."))
    }));

    it("should throw an error in case both schema attributes are present", inject(function($rootScope, $compile, $q) {
        var scope = $rootScope.$new();
        scope.schema = {};
        scope.fetchSchema = function() {
            var p = $q.defer();
            p.resolve(scope.schema);
            return p;
        };
        scope.uiSchema = {};
        scope.data = {};
        expect(function() {
            $compile('<jsonforms data="data" schema="schema" async-schema="fetchSchema()" ui-schema="uiSchema"/>')(scope);
            scope.$digest();
        }).toThrow(Error("You cannot specify both the 'schema' and the 'async-schema' attribute at the same time."))
    }));

    it("should throw an error in case both ui-schema attributes are present", inject(function($rootScope, $compile, $q) {
        var scope = $rootScope.$new();
        scope.schema = {};
        scope.uiSchema = {};
        scope.data = {};
        scope.fetchUiSchema = function() {
            var p = $q.defer();
            p.resolve(scope.uiSchema);
            return p
        };
        expect(function() {
            $compile('<jsonforms data="data" async-ui-schema="fetchUiSchema()" ui-schema="uiSchema" schema="schema"/>')(scope);
            scope.$digest();
        }).toThrow(Error("You cannot specify both the 'ui-schema' and the 'async-ui-schema' attribute at the same time."))
    }));
});

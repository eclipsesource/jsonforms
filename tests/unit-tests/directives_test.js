'use strict';

describe('jsonforms directive', function() {

    // load all necessary modules and templates
    beforeEach(module('jsonForms.services'));
    beforeEach(module('jsonForms.directives'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/element.html'));

    //it("should render a simple input field", inject(function ($rootScope, $compile) {
    //    var scope = $rootScope.$new();
    //    // the jsonforms directive expects functions that return promises
    //    scope.schema = {
    //        "type": "object",
    //        "properties": {
    //            "name": { "type": "string" }
    //        }
    //    };
    //    scope.data = { name: 'John Doe' };
    //    scope.uiSchema = {
    //        "type": "Control",
    //        "label": "First name",
    //        "scope": { "$ref": "#/properties/name" }
    //    };
    //    var el = $compile('<jsonforms schema="schema" data="data" ui-schema="uiSchema">')(scope);
    //    scope.$digest();
    //    // simple assert, we should test for more complex logic here
    //    expect(el.html()).toContain("form");
    //}));


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
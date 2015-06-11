'use strict';

describe('jsonforms directive', function() {

    var el, scope;

    // load all necessary modules and templates
    beforeEach(module('jsonForms.dataServices'));
    beforeEach(module('jsonForms.directives'));
    beforeEach(module('jsonForms.services'));
    beforeEach(module('../templates/form.html'));
    beforeEach(module('../templates/element.html'));

    beforeEach(inject(function($rootScope, $compile, $q) {
        scope = $rootScope.$new();
        // the jsonforms directive expects functions that return promises
        scope.fetchSchema = function() {
            var deferred = $q.defer();
            deferred.resolve({
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            });
            return deferred.promise;
        };
        scope.fetchData = function () {
            var deferred = $q.defer();
            deferred.resolve({
                name: 'John Doe'
            });
            return deferred.promise;
        };
        scope.fetchUiSchema = function() {
            var deferred = $q.defer();
            deferred.resolve({
                "type": "Control",
                "name": "First name",
                "scope": {
                    "type": "relative",
                    "path": "name"
                }
            });
            return deferred.promise;
        };
        element = '<jsonforms schema="fetchSchema" data="fetchData" ui-schema="fetchUiSchema">';
        el = $compile(element)(scope);
        scope.$digest();
    }));

    it("should render a simple input field", inject(function () {
        // simple assert, we should test for more complex logic here
        expect(el.html()).toContain("form");
    }));

});
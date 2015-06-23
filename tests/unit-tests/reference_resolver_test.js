'use strict';

describe('ReferenceResolver', function() {

    var ReferenceResolver;

    beforeEach(module('jsonForms.services'));
    beforeEach(inject(function($injector) {
        ReferenceResolver = $injector.get('ReferenceResolver');
    }));

    it("should resolve properties path on instance", function () {

        var obj = {
            "foo": {
                "bar": {
                    "scope": {
                        "$ref": { "type": "string" }
                    }
                }
            }
        };

        expect(ReferenceResolver.resolve(obj, "#/foo/bar").type).toBe("string");
    });

});
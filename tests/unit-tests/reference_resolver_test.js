'use strict';

describe('ReferencResolver', function() {

    var InstanceRefResolver;

    beforeEach(module('jsonForms.services'));
    beforeEach(inject(function($injector) {
        InstanceRefResolver = $injector.get('ReferenceResolver');
    }));

    it("should correctly normalize paths", function () {
        expect(InstanceRefResolver.normalize("/foo")).toBe("foo");
    });

    it("should resolve properties path on instance", function () {

        var obj = {
            "foo": {
                "bar": {
                    "baz": 1,
                    "quux": 2
                }
            }
        };

        expect(InstanceRefResolver.resolve(obj, "foo/bar/baz")).toBe(1);
    });

});
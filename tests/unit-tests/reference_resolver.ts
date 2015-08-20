/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>

describe('ReferenceResolver', () => {

    var ReferenceResolver: jsonforms.services.IReferenceResolver;

    beforeEach(module('jsonForms.services'));
    beforeEach(() => {
        inject(function(_ReferenceResolver_: jsonforms.services.IReferenceResolver) {
            ReferenceResolver = _ReferenceResolver_;
        });
    });


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

        expect(ReferenceResolver.resolveUi(obj, "#/foo/bar").type).toBe("string");
    });

});
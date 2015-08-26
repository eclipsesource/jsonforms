/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>

describe('ReferenceResolver', () => {

    var ReferenceResolver: JSONForms.IReferenceResolver;

    beforeEach(module('jsonForms.services'));
    beforeEach(() => {
        inject(function(_ReferenceResolver_: JSONForms.IReferenceResolver) {
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
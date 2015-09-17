/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>

describe('PathResolver', () => {

    var PathResolver: JSONForms.IPathResolver;

    beforeEach(module('jsonForms.services'));
    beforeEach(() => {
        inject(function(_PathResolver_: JSONForms.IPathResolver) {
            PathResolver = _PathResolver_;
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

        expect(PathResolver.resolveUi(obj, "#/foo/bar").type).toBe("string");
    });

});
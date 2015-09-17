/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>
describe('PathResolver', function () {
    var PathResolver;
    beforeEach(module('jsonforms.services'));
    beforeEach(function () {
        inject(['PathResolver', function (_PathResolver_) {
                PathResolver = _PathResolver_;
            }]);
    });
    it("should resolve properties path on the UI schema", function () {
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

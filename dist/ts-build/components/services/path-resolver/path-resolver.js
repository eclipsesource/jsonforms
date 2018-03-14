"use strict";
var pathutil_1 = require('../pathutil');
var RefResolver = (function () {
    function RefResolver() {
    }
    RefResolver.prototype.toInstancePath = function (path) {
        return pathutil_1.PathUtil.normalize(path);
    };
    RefResolver.prototype.resolveUi = function (instance, uiPath) {
        return this.resolveInstance(instance, uiPath + '/scope/$ref');
    };
    RefResolver.prototype.resolveInstance = function (instance, schemaPath) {
        return this.innerResolveInstance(instance, schemaPath, false);
    };
    ;
    RefResolver.prototype.resolveSchema = function (schema, path) {
        try {
            var fragments = pathutil_1.PathUtil.toPropertyFragments(path);
            return fragments.reduce(function (subSchema, fragment) {
                if (fragment === '#') {
                    return subSchema;
                }
                else if (subSchema instanceof Array) {
                    return subSchema.map(function (item) {
                        return item[fragment];
                    });
                }
                return subSchema[fragment];
            }, schema);
        }
        catch (err) {
            return undefined;
        }
    };
    ;
    RefResolver.prototype.lastFragment = function (schemaPath) {
        var fragments = pathutil_1.PathUtil.normalizeFragments(schemaPath);
        return fragments[fragments.length - 1];
    };
    RefResolver.prototype.resolveToLastModel = function (instance, schemaPath) {
        var fragments = pathutil_1.PathUtil.normalizeFragments(schemaPath);
        var fragmentsToObject = fragments.slice(0, fragments.length - 1);
        return this.innerResolveInstance(instance, fragmentsToObject.join('/'), true);
    };
    RefResolver.prototype.innerResolveInstance = function (instance, schemaPath, createMissing) {
        var fragments = pathutil_1.PathUtil.toPropertyFragments(this.toInstancePath(schemaPath));
        return fragments.reduce(function (currObj, fragment) {
            if (currObj === undefined) {
                return undefined;
            }
            if (currObj instanceof Array) {
                return currObj.map(function (item) { return item[fragment]; });
            }
            if (!currObj.hasOwnProperty(fragment) && createMissing) {
                currObj[fragment] = {};
            }
            return currObj[fragment];
        }, instance);
    };
    ;
    return RefResolver;
}());
exports.RefResolver = RefResolver;
exports.PathResolver = new RefResolver();
//# sourceMappingURL=path-resolver.js.map
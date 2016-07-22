var pathutil_1 = require('../pathutil');
var PathResolver = (function () {
    function PathResolver() {
    }
    PathResolver.toInstancePath = function (path) {
        return pathutil_1.PathUtil.normalize(path);
    };
    PathResolver.resolveUi = function (instance, uiPath) {
        return this.resolveInstance(instance, uiPath + '/scope/$ref');
    };
    PathResolver.resolveInstance = function (instance, schemaPath) {
        return this.innerResolveInstance(instance, schemaPath, false);
    };
    ;
    PathResolver.resolveSchema = function (schema, path) {
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
    PathResolver.lastFragment = function (schemaPath) {
        var fragments = pathutil_1.PathUtil.normalizeFragments(schemaPath);
        return fragments[fragments.length - 1];
    };
    PathResolver.resolveToLastModel = function (instance, schemaPath) {
        var fragments = pathutil_1.PathUtil.normalizeFragments(schemaPath);
        var fragmentsToObject = fragments.slice(0, fragments.length - 1);
        return this.innerResolveInstance(instance, fragmentsToObject.join('/'), true);
    };
    PathResolver.innerResolveInstance = function (instance, schemaPath, createMissing) {
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
    return PathResolver;
})();
exports.PathResolver = PathResolver;
//# sourceMappingURL=jsonforms-pathresolver.js.map
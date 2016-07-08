var pathutil_1 = require('../pathutil');
var PathResolver = (function () {
    function PathResolver() {
        this.pathMapping = {};
    }
    PathResolver.prototype.toInstancePath = function (path) {
        return pathutil_1.PathUtil.normalize(path);
    };
    PathResolver.prototype.resolveUi = function (instance, uiPath) {
        var p = uiPath + '/scope/$ref';
        if (this.pathMapping !== undefined && this.pathMapping.hasOwnProperty(p)) {
            p = this.pathMapping[p];
        }
        return this.resolveInstance(instance, p);
    };
    PathResolver.prototype.resolveInstance = function (instance, schemaPath) {
        return this.innerResolveInstance(instance, schemaPath, false);
    };
    ;
    PathResolver.prototype.resolveSchema = function (schema, path) {
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
    PathResolver.prototype.lastFragment = function (schemaPath) {
        var fragments = pathutil_1.PathUtil.normalizeFragments(schemaPath);
        return fragments[fragments.length - 1];
    };
    PathResolver.prototype.resolveToLastModel = function (instance, schemaPath) {
        var fragments = pathutil_1.PathUtil.normalizeFragments(schemaPath);
        var fragmentsToObject = fragments.slice(0, fragments.length - 1);
        return this.innerResolveInstance(instance, fragmentsToObject.join('/'), true);
    };
    PathResolver.prototype.innerResolveInstance = function (instance, schemaPath, createMissing) {
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
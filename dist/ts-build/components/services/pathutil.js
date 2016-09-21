"use strict";
require('lodash');
var PathUtil = (function () {
    function PathUtil() {
    }
    PathUtil.normalize = function (schemaPath) {
        return _.flow(PathUtil.normalizeFragments, PathUtil.joinWithSlash)(schemaPath);
    };
    PathUtil.normalizeFragments = function (schemaPath) {
        return _.flow(PathUtil.toPropertyFragments, PathUtil.filterNonKeywords)(schemaPath);
    };
    PathUtil.toPropertyFragments = function (path) {
        if (path === undefined) {
            return [];
        }
        return path.split('/').filter(function (fragment) { return fragment.length > 0; });
    };
    PathUtil.toPropertyAccessString = function (propertyPath) {
        if (propertyPath === null || propertyPath === undefined) {
            throw new Error('Property path must not be undefined.');
        }
        var fragments = PathUtil.toPropertyFragments(propertyPath);
        return fragments.reduce(function (propertyAccessString, fragment) {
            return (propertyAccessString + "['" + fragment + "']");
        }, '');
    };
    PathUtil.init = function (schemaPath) {
        return '/' + _.flow(PathUtil.toPropertyFragments, _.initial, PathUtil.joinWithSlash)(schemaPath);
    };
    PathUtil.filterIndexes = function (path) {
        return PathUtil.toPropertyFragments(path)
            .filter(function (fragment, index, fragments) {
            return !(fragment.match(PathUtil.numberRegex) && fragments[index - 1] === 'items');
        }).join('/');
    };
    PathUtil.filterNonKeywords = function (fragments) {
        return fragments.filter(function (fragment) { return !_.includes(PathUtil.Keywords, fragment); });
    };
    PathUtil.beautifiedLastFragment = function (schemaPath) {
        return _.flow(PathUtil.lastFragment, PathUtil.beautify)(schemaPath);
    };
    PathUtil.lastFragment = function (path) {
        return path.substr(path.lastIndexOf('/') + 1);
    };
    PathUtil.beautify = function (text) { return _.startCase(text); };
    ;
    PathUtil.Keywords = ['items', 'properties', '#'];
    PathUtil.joinWithSlash = _.partialRight(_.join, '/');
    PathUtil.numberRegex = /^\d+$/;
    return PathUtil;
}());
exports.PathUtil = PathUtil;
//# sourceMappingURL=pathutil.js.map
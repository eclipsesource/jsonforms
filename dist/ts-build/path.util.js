"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValuePropertyPair = function (instance, path) {
    var validPathSegments = toDataPathSegments(path);
    var resolvedInstance = validPathSegments
        .slice(0, validPathSegments.length - 1)
        .map(function (segment) { return decodeURIComponent(segment); })
        .reduce(function (curInstance, decodedSegment) {
        if (!curInstance.hasOwnProperty(decodedSegment)) {
            curInstance[decodedSegment] = {};
        }
        return curInstance[decodedSegment];
    }, instance);
    return {
        instance: resolvedInstance,
        property: validPathSegments.length > 0 ?
            decodeURIComponent(validPathSegments[validPathSegments.length - 1]) : undefined
    };
};
var toDataPathSegments = function (path) {
    var segments = path.split('/');
    var startFromRoot = segments[0] === '#' || segments[0] === '';
    if (startFromRoot) {
        return segments.filter(function (segment, index) {
            if (index === 0) {
                return false;
            }
            else if (index % 2 === 1) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    return segments.filter(function (segment, index) {
        if (index % 2 === 0) {
            return false;
        }
        else {
            return true;
        }
    });
};
exports.toDataPath = function (path) {
    return toDataPathSegments(path).join('/');
};
exports.resolveSchema = function (schema, path) {
    var validPathSegments = path.split('/');
    var invalidSegment = function (pathSegment) { return pathSegment === '#' || pathSegment === undefined || pathSegment === ''; };
    var resultSchema = validPathSegments.reduce(function (curSchema, pathSegment) {
        return invalidSegment(pathSegment) ? curSchema : curSchema[pathSegment];
    }, schema);
    if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
        return exports.retrieveResolvableSchema(schema, resultSchema.$ref);
    }
    return resultSchema;
};
var findAllRefs = function (schema, result) {
    if (result === void 0) { result = {}; }
    if (schema.type === 'object' && schema.properties !== undefined) {
        Object.keys(schema.properties).forEach(function (key) { return findAllRefs(schema.properties[key], result); });
    }
    if (schema.type === 'array' && schema.items !== undefined) {
        // FIXME Do we want to support tupples? If so how do we render this?
        if (Array.isArray(schema.items)) {
            schema.items.forEach(function (child) { return findAllRefs(child, result); });
        }
        findAllRefs(schema.items, result);
    }
    if (schema.$ref !== undefined) {
        result[schema.$ref] = schema;
    }
    return result;
};
exports.retrieveResolvableSchema = function (full, reference) {
    var child = exports.resolveSchema(full, reference);
    var allRefs = findAllRefs(child);
    var innerSelfReference = allRefs[reference];
    if (innerSelfReference !== undefined) {
        innerSelfReference.$ref = '#';
    }
    return child;
};
//# sourceMappingURL=path.util.js.map
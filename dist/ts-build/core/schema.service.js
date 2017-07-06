"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var path_util_1 = require("../path.util");
var isObject = function (schema) {
    return schema.properties !== undefined;
};
var isArray = function (schema) {
    return schema.items !== undefined;
};
var deepCopy = function (object) {
    return JSON.parse(JSON.stringify(object));
};
var findAllRefs = function (schema, result) {
    if (result === void 0) { result = {}; }
    if (isObject(schema)) {
        Object.keys(schema.properties).forEach(function (key) {
            return findAllRefs(schema.properties[key], result);
        });
    }
    if (isArray(schema)) {
        // FIXME Do we want to support tupples? If so how do we render this?
        if (!Array.isArray(schema.items)) {
            findAllRefs(schema.items, result);
        }
    }
    if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach(function (child) { return findAllRefs(child, result); });
    }
    if (schema.$ref !== undefined) {
        result[schema.$ref] = schema;
    }
    // tslint:disable:no-string-literal
    if (schema['links'] !== undefined) {
        schema['links'].forEach(function (link) { return result[link.targetSchema.$ref] = schema; });
    }
    // tslint:enable:no-string-literal
    return result;
};
var addToArray = function (key) { return function (data) { return function (valueToAdd) {
    if (data[key] === undefined) {
        data[key] = [];
    }
    var childArray = data[key];
    childArray.push(valueToAdd);
}; }; };
var deleteFromArray = function (key) { return function (data) { return function (valueToDelete) {
    var childArray = data[key];
    if (!childArray) {
        return;
    }
    var indexToDelete = childArray.indexOf(valueToDelete);
    childArray.splice(indexToDelete - 1, 1);
}; }; };
var getArray = function (key) { return function (data) {
    return data[key];
}; };
var addReference = function (schema, variable, pathToContainment) {
    return function (root, data, toAdd) {
        var containment = pathToContainment
            .split('/')
            .reduce(function (elem, path) {
            if (path === '#' || path === '') {
                return elem;
            }
            return elem[path];
        }, root);
        var index = containment.indexOf(toAdd);
        if (schema.properties[variable].type === 'array') {
            if (!data[variable]) {
                data[variable] = [];
            }
            data[variable].push(index);
        }
        else {
            data[variable] = index;
        }
    };
};
var getReference = function (href, variable, variableWrapped) {
    return function (root, data) {
        var variableValue = data[variable];
        var pathToObject = href.replace(variableWrapped, variableValue);
        return pathToObject
            .split('/')
            .reduce(function (elem, path) {
            if (path === '#') {
                return elem;
            }
            return elem[path];
        }, root);
    };
};
var ContainmentPropertyImpl = (function () {
    function ContainmentPropertyImpl(innerSchema, key, name, addFunction, deleteFunction, getFunction) {
        this.innerSchema = innerSchema;
        this.key = key;
        this.name = name;
        this.addFunction = addFunction;
        this.deleteFunction = deleteFunction;
        this.getFunction = getFunction;
    }
    Object.defineProperty(ContainmentPropertyImpl.prototype, "label", {
        get: function () {
            return _.find([
                this.innerSchema.title,
                this.name,
                this.innerSchema.id,
                this.key
            ], function (n) { return !_.isEmpty(n); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainmentPropertyImpl.prototype, "schema", {
        get: function () {
            return this.innerSchema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainmentPropertyImpl.prototype, "property", {
        get: function () {
            return this.key;
        },
        enumerable: true,
        configurable: true
    });
    ContainmentPropertyImpl.prototype.addToData = function (data) {
        return this.addFunction(data);
    };
    ContainmentPropertyImpl.prototype.deleteFromData = function (data) {
        return this.deleteFunction(data);
    };
    ContainmentPropertyImpl.prototype.getData = function (data) {
        return this.getFunction(data);
    };
    return ContainmentPropertyImpl;
}());
var ReferencePropertyImpl = (function () {
    function ReferencePropertyImpl(innerSchema, innerTargetSchema, key, name, addFunction, getFunction) {
        this.innerSchema = innerSchema;
        this.innerTargetSchema = innerTargetSchema;
        this.key = key;
        this.name = name;
        this.addFunction = addFunction;
        this.getFunction = getFunction;
    }
    Object.defineProperty(ReferencePropertyImpl.prototype, "label", {
        get: function () {
            return _.find([
                this.innerSchema.title,
                this.name,
                this.innerSchema.id,
                this.key
            ], function (n) { return !_.isEmpty(n); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReferencePropertyImpl.prototype, "schema", {
        get: function () {
            return this.innerSchema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReferencePropertyImpl.prototype, "property", {
        get: function () {
            return this.key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReferencePropertyImpl.prototype, "targetSchema", {
        get: function () {
            return this.innerTargetSchema;
        },
        enumerable: true,
        configurable: true
    });
    ReferencePropertyImpl.prototype.addToData = function (root, data, valueToAdd) {
        this.addFunction(root, data, valueToAdd);
    };
    ReferencePropertyImpl.prototype.getData = function (root, data) {
        return this.getFunction(root, data);
    };
    return ReferencePropertyImpl;
}());
exports.isContainmentProperty = function (property) {
    return property instanceof ContainmentPropertyImpl;
};
exports.isReferenceProperty = function (property) {
    return property instanceof ReferencePropertyImpl;
};
var SchemaServiceImpl = (function () {
    function SchemaServiceImpl(rootSchema) {
        this.rootSchema = rootSchema;
        this.selfContainedSchemas = {};
        if (_.isEmpty(rootSchema.id)) {
            rootSchema.id = '#generatedRootID';
        }
        this.selfContainedSchemas[rootSchema.id] = this.rootSchema;
    }
    SchemaServiceImpl.prototype.getContainmentProperties = function (schema) {
        return this.getContainment('root', 'root', schema, schema, false, null, null, null);
    };
    SchemaServiceImpl.prototype.hasContainmentProperties = function (schema) {
        return this.getContainmentProperties(schema).length !== 0;
    };
    SchemaServiceImpl.prototype.getSelfContainedSchema = function (parentSchema, refPath) {
        var schema = path_util_1.resolveSchema(parentSchema, refPath);
        schema = deepCopy(schema);
        if (_.isEmpty(schema.id)) {
            schema.id = '#' + refPath;
        }
        if (this.selfContainedSchemas.hasOwnProperty(schema.id)) {
            return this.selfContainedSchemas[schema.id];
        }
        this.selfContainSchema(schema, schema, refPath);
        this.selfContainedSchemas[schema.id] = schema;
        return schema;
    };
    SchemaServiceImpl.prototype.getReferenceProperties = function (schema) {
        var _this = this;
        if (schema.$ref !== undefined) {
            return this.getReferenceProperties(this.getSelfContainedSchema(this.rootSchema, schema.$ref));
        }
        // tslint:disable:no-string-literal
        if (schema['links']) {
            var links = schema['links'];
            // tslint:enable:no-string-literal
            var result_1 = [];
            links.forEach(function (link) {
                if (_.isEmpty(link.targetSchema) || _.isEmpty(link.href)) {
                    // FIXME log
                    return;
                }
                var targetSchema = _this.getSelfContainedSchema(_this.rootSchema, link.targetSchema.$ref);
                var href = link.href;
                var variableWrapped = href.match(/\{.*\}/)[0];
                var pathToContainment = href.split(/\{.*\}/)[0];
                var variable = variableWrapped.substring(1, variableWrapped.length - 1);
                result_1.push(new ReferencePropertyImpl(schema.properties[variable], targetSchema, variable, variable, addReference(schema, variable, pathToContainment), getReference(href, variable, variableWrapped)));
            });
            return result_1;
        }
        if (schema.anyOf !== undefined) {
            return schema.anyOf.reduce(function (prev, cur) { return prev.concat(_this.getReferenceProperties(cur)); }, []);
        }
        return [];
    };
    SchemaServiceImpl.prototype.getContainment = function (key, name, schema, rootSchema, isInContainment, addFunction, deleteFunction, getFunction) {
        var _this = this;
        if (schema.$ref !== undefined) {
            return this.getContainment(key, schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1), this.getSelfContainedSchema(rootSchema, schema.$ref), rootSchema, isInContainment, addFunction, deleteFunction, getFunction);
        }
        if (isObject(schema)) {
            return isInContainment ? [
                new ContainmentPropertyImpl(schema, key, name, addFunction, deleteFunction, getFunction)
            ] : Object.keys(schema.properties)
                .reduce(function (prev, cur) {
                return prev.concat(_this.getContainment(cur, cur, schema.properties[cur], rootSchema, false, addFunction, deleteFunction, getFunction));
            }, []);
        }
        if (isArray(schema) && !Array.isArray(schema.items)) {
            return this.getContainment(key, name, schema.items, rootSchema, true, addToArray(key), deleteFromArray(key), getArray(key));
        }
        if (schema.anyOf !== undefined) {
            return schema.anyOf
                .reduce(function (prev, cur) {
                return prev.concat(_this.getContainment(key, undefined, cur, rootSchema, isInContainment, addFunction, deleteFunction, getFunction));
            }, []);
        }
        return [];
    };
    /**
     * Makes the given JsonSchema self-contained. This means all referenced definitions
     * are contained in the schema's definitions block and references equal to
     * outerReference are set to root ('#').
     *
     * @param schema The current schema to make self contained
     * @param outerSchema The root schema to which missing definitions are added
     * @param outerReference The reference which is considered to be self ('#')
     * @param includedDefs The list of definitions which were already added to the outer schema
     */
    SchemaServiceImpl.prototype.selfContainSchema = function (schema, outerSchema, outerReference, includedDefs) {
        var _this = this;
        if (includedDefs === void 0) { includedDefs = ['#']; }
        // Step 1: get all used references
        var allInnerRefs = findAllRefs(schema);
        Object.keys(allInnerRefs).forEach(function (innerRef) {
            var resolved = path_util_1.resolveSchema(_this.rootSchema, innerRef);
            // Step 2: recognize refs to outer self and set to '#'
            if (innerRef === outerReference || resolved.id === schema.id) {
                if (allInnerRefs[innerRef] !== undefined) {
                    if (!_.isEmpty(allInnerRefs[innerRef].$ref)) {
                        allInnerRefs[innerRef].$ref = '#';
                        // tslint:disable:no-string-literal
                    }
                    else if (!_.isEmpty(allInnerRefs[innerRef]['links'])) {
                        allInnerRefs[innerRef]['links'].forEach(function (link) {
                            // tslint:enable:no-string-literal
                            if (link.targetSchema.$ref === innerRef) {
                                link.targetSchema.$ref = '#';
                            }
                        });
                    }
                }
                return;
            }
            // Step 3: add definitions for non-existant refs to definitions block
            if (includedDefs.indexOf(innerRef) > -1) {
                // definition was already added to schema
                return;
            }
            if (!_.isEmpty(resolved.anyOf)) {
                resolved.anyOf.forEach(function (inner) {
                    _this.copyAndResolveInner(inner, innerRef, outerSchema, outerReference, includedDefs);
                });
            }
            else {
                _this.copyAndResolveInner(resolved, innerRef, outerSchema, outerReference, includedDefs);
            }
        });
    };
    SchemaServiceImpl.prototype.copyAndResolveInner = function (resolved, innerRef, outerSchema, outerReference, includedDefs) {
        // get a copy of the referenced type's schema
        var definitionSchema = deepCopy(resolved);
        if (outerSchema.definitions === undefined || outerSchema.definitions === null) {
            outerSchema.definitions = {};
        }
        var defName = innerRef.substr(innerRef.lastIndexOf('/') + 1);
        outerSchema.definitions[defName] = definitionSchema;
        includedDefs.push(innerRef);
        this.selfContainSchema(definitionSchema, outerSchema, outerReference, includedDefs);
    };
    return SchemaServiceImpl;
}());
exports.SchemaServiceImpl = SchemaServiceImpl;
//# sourceMappingURL=schema.service.js.map
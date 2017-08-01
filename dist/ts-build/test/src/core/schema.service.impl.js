"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const path_util_1 = require("../path.util");
const schema_service_1 = require("./schema.service");
const isObject = (schema) => {
    return schema.properties !== undefined;
};
const isArray = (schema) => {
    return schema.items !== undefined;
};
const deepCopy = (object) => {
    return JSON.parse(JSON.stringify(object));
};
const findAllRefs = (schema, result = {}) => {
    if (isObject(schema)) {
        Object.keys(schema.properties).forEach(key => findAllRefs(schema.properties[key], result));
    }
    if (isArray(schema)) {
        // FIXME Do we want to support tupples? If so how do we render this?
        if (!Array.isArray(schema.items)) {
            findAllRefs(schema.items, result);
        }
    }
    if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach(child => findAllRefs(child, result));
    }
    if (schema.$ref !== undefined) {
        result[schema.$ref] = schema;
    }
    // tslint:disable:no-string-literal
    if (schema['links'] !== undefined) {
        schema['links'].forEach(link => result[link.targetSchema.$ref] = schema);
    }
    // tslint:enable:no-string-literal
    return result;
};
const addToArray = (key) => (data) => (valueToAdd, neighbourValue, insertAfter = true) => {
    if (data[key] === undefined) {
        data[key] = [];
    }
    const childArray = data[key];
    if (neighbourValue !== undefined && neighbourValue !== null) {
        const index = childArray.indexOf(neighbourValue);
        if (insertAfter) {
            if (index >= 0 && index < (childArray.length - 1)) {
                childArray.splice(index + 1, 0, valueToAdd);
                return;
            }
            // TODO proper logging
            console.warn('Could not add the new value after the given neighbour value. ' +
                'The new value was added at the end.');
        }
        else {
            if (index >= 0) {
                childArray.splice(index, 0, valueToAdd);
                return;
            }
            // TODO proper logging
            console.warn('The given neighbour value could not be found. ' +
                'The new value was added at the end.');
        }
    }
    // default behavior: add at the end
    childArray.push(valueToAdd);
};
const deleteFromArray = (key) => (data) => (valueToDelete) => {
    const childArray = data[key];
    if (!childArray) {
        return;
    }
    const indexToDelete = childArray.indexOf(valueToDelete);
    childArray.splice(indexToDelete, 1);
};
const getArray = (key) => (data) => {
    return data[key];
};
const addReference = (schema, variable, pathToContainment) => (root, data, toAdd) => {
    const containment = pathToContainment
        .split('/')
        .reduce((elem, path) => {
        if (path === '#' || path === '') {
            return elem;
        }
        return elem[path];
    }, root);
    const index = containment.indexOf(toAdd);
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
const getReference = (href, variable, variableWrapped) => (root, data) => {
    const variableValue = data[variable];
    const pathToObject = href.replace(variableWrapped, variableValue);
    return pathToObject
        .split('/')
        .reduce((elem, path) => {
        if (path === '#') {
            return elem;
        }
        return elem[path];
    }, root);
};
class SchemaServiceImpl {
    constructor(rootSchema) {
        this.rootSchema = rootSchema;
        this.selfContainedSchemas = {};
        if (_.isEmpty(rootSchema.id)) {
            rootSchema.id = '#generatedRootID';
        }
        this.selfContainedSchemas[rootSchema.id] = this.rootSchema;
    }
    getContainmentProperties(schema) {
        return this.getContainment('root', 'root', schema, schema, false, null, null, null);
    }
    hasContainmentProperties(schema) {
        return this.getContainmentProperties(schema).length !== 0;
    }
    getSelfContainedSchema(parentSchema, refPath) {
        let schema = path_util_1.resolveSchema(parentSchema, refPath);
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
    }
    getReferenceProperties(schema) {
        if (schema.$ref !== undefined) {
            return this.getReferenceProperties(this.getSelfContainedSchema(this.rootSchema, schema.$ref));
        }
        // tslint:disable:no-string-literal
        if (schema['links']) {
            const links = schema['links'];
            // tslint:enable:no-string-literal
            const result = [];
            links.forEach(link => {
                if (_.isEmpty(link.targetSchema) || _.isEmpty(link.href)) {
                    // FIXME log
                    return;
                }
                const targetSchema = this.getSelfContainedSchema(this.rootSchema, link.targetSchema.$ref);
                const href = link.href;
                const variableWrapped = href.match(/\{.*\}/)[0];
                const pathToContainment = href.split(/\{.*\}/)[0];
                const variable = variableWrapped.substring(1, variableWrapped.length - 1);
                result.push(new schema_service_1.ReferencePropertyImpl(schema.properties[variable], targetSchema, variable, variable, addReference(schema, variable, pathToContainment), getReference(href, variable, variableWrapped)));
            });
            return result;
        }
        if (schema.anyOf !== undefined) {
            return schema.anyOf.reduce((prev, cur) => prev.concat(this.getReferenceProperties(cur)), []);
        }
        return [];
    }
    getContainment(key, name, schema, rootSchema, isInContainment, addFunction, deleteFunction, getFunction) {
        if (schema.$ref !== undefined) {
            return this.getContainment(key, schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1), this.getSelfContainedSchema(rootSchema, schema.$ref), rootSchema, isInContainment, addFunction, deleteFunction, getFunction);
        }
        if (isObject(schema)) {
            return isInContainment ? [
                new schema_service_1.ContainmentPropertyImpl(schema, key, name, addFunction, deleteFunction, getFunction)
            ] : Object.keys(schema.properties)
                .reduce((prev, cur) => prev.concat(this.getContainment(cur, cur, schema.properties[cur], rootSchema, false, addFunction, deleteFunction, getFunction)), []);
        }
        if (isArray(schema) && !Array.isArray(schema.items)) {
            return this.getContainment(key, name, schema.items, rootSchema, true, addToArray(key), deleteFromArray(key), getArray(key));
        }
        if (schema.anyOf !== undefined) {
            return schema.anyOf
                .reduce((prev, cur) => prev.concat(this.getContainment(key, undefined, cur, rootSchema, isInContainment, addFunction, deleteFunction, getFunction)), []);
        }
        return [];
    }
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
    selfContainSchema(schema, outerSchema, outerReference, includedDefs = ['#']) {
        // Step 1: get all used references
        const allInnerRefs = findAllRefs(schema);
        Object.keys(allInnerRefs).forEach(innerRef => {
            const resolved = path_util_1.resolveSchema(this.rootSchema, innerRef);
            // Step 2: recognize refs to outer self and set to '#'
            if (innerRef === outerReference || resolved.id === schema.id) {
                if (allInnerRefs[innerRef] !== undefined) {
                    if (!_.isEmpty(allInnerRefs[innerRef].$ref)) {
                        allInnerRefs[innerRef].$ref = '#';
                        // tslint:disable:no-string-literal
                    }
                    else if (!_.isEmpty(allInnerRefs[innerRef]['links'])) {
                        allInnerRefs[innerRef]['links'].forEach(link => {
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
                resolved.anyOf.forEach(inner => {
                    this.copyAndResolveInner(inner, innerRef, outerSchema, outerReference, includedDefs);
                });
            }
            else {
                this.copyAndResolveInner(resolved, innerRef, outerSchema, outerReference, includedDefs);
            }
        });
    }
    copyAndResolveInner(resolved, innerRef, outerSchema, outerReference, includedDefs) {
        // get a copy of the referenced type's schema
        const definitionSchema = deepCopy(resolved);
        if (outerSchema.definitions === undefined || outerSchema.definitions === null) {
            outerSchema.definitions = {};
        }
        const defName = innerRef.substr(innerRef.lastIndexOf('/') + 1);
        outerSchema.definitions[defName] = definitionSchema;
        includedDefs.push(innerRef);
        this.selfContainSchema(definitionSchema, outerSchema, outerReference, includedDefs);
    }
}
exports.SchemaServiceImpl = SchemaServiceImpl;
//# sourceMappingURL=schema.service.impl.js.map
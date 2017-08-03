"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const core_1 = require("../core");
class ContainmentPropertyImpl {
    constructor(innerSchema, key, name, addFunction, deleteFunction, getFunction) {
        this.innerSchema = innerSchema;
        this.key = key;
        this.name = name;
        this.addFunction = addFunction;
        this.deleteFunction = deleteFunction;
        this.getFunction = getFunction;
    }
    get label() {
        return _.find([
            this.innerSchema.title,
            this.name,
            this.innerSchema.id,
            this.key
        ], n => !_.isEmpty(n));
    }
    get schema() {
        return this.innerSchema;
    }
    get property() {
        return this.key;
    }
    addToData(data) {
        return this.addFunction(data);
    }
    deleteFromData(data) {
        return this.deleteFunction(data);
    }
    getData(data) {
        return this.getFunction(data);
    }
}
exports.ContainmentPropertyImpl = ContainmentPropertyImpl;
class ReferencePropertyImpl {
    constructor(innerSchema, innerTargetSchema, key, name, pathToContainment, identifyingProperty, addFunction, getFunction) {
        this.innerSchema = innerSchema;
        this.innerTargetSchema = innerTargetSchema;
        this.key = key;
        this.name = name;
        this.pathToContainment = pathToContainment;
        this.identifyingProperty = identifyingProperty;
        this.addFunction = addFunction;
        this.getFunction = getFunction;
    }
    get label() {
        return _.find([
            this.innerSchema.title,
            this.name,
            this.innerSchema.id,
            this.key
        ], n => !_.isEmpty(n));
    }
    get schema() {
        return this.innerSchema;
    }
    get property() {
        return this.key;
    }
    get targetSchema() {
        return this.innerTargetSchema;
    }
    addToData(root, data, valueToAdd) {
        this.addFunction(root, data, valueToAdd);
    }
    getData(root, data) {
        return this.getFunction(root, data);
    }
    findReferenceTargets(rootData) {
        const candidates = this.pathToContainment
            .split('/')
            .reduce((prev, cur) => {
            if (cur === '#') {
                return prev;
            }
            return prev[cur];
        }, rootData);
        if (!_.isEmpty(candidates)) {
            return core_1.JsonForms.filterObjectsByType(candidates, this.targetSchema.id);
        }
        return [];
    }
    resolveReference(rootData, propertyValue) {
        if (_.isEmpty(propertyValue) || _.isEmpty(this.identifyingProperty)) {
            return null;
        }
        // get all objects that could be referenced.
        const candidates = this.findReferenceTargets(rootData);
        // use identifying property to identify the referenced property by the given propertyValue
        const resultList = candidates.filter(value => {
            return value[this.identifyingProperty] === propertyValue;
        });
        if (_.isEmpty(resultList)) {
            return null;
        }
        if (resultList.length > 1) {
            throw Error('There was more than one possible reference target with value \'' + propertyValue
                + '\' in the identifying property \'' + this.identifyingProperty + '\'.');
        }
        return _.first(resultList);
    }
}
exports.ReferencePropertyImpl = ReferencePropertyImpl;
exports.isContainmentProperty = (property) => {
    return property instanceof ContainmentPropertyImpl;
};
exports.isReferenceProperty = (property) => {
    return property instanceof ReferencePropertyImpl;
};
//# sourceMappingURL=schema.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
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
    constructor(innerSchema, innerTargetSchema, key, name, addFunction, getFunction) {
        this.innerSchema = innerSchema;
        this.innerTargetSchema = innerTargetSchema;
        this.key = key;
        this.name = name;
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
}
exports.ReferencePropertyImpl = ReferencePropertyImpl;
exports.isContainmentProperty = (property) => {
    return property instanceof ContainmentPropertyImpl;
};
exports.isReferenceProperty = (property) => {
    return property instanceof ReferencePropertyImpl;
};
//# sourceMappingURL=schema.service.js.map
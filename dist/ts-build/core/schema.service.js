"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var core_1 = require("../core");
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
exports.ContainmentPropertyImpl = ContainmentPropertyImpl;
var ReferencePropertyImpl = (function () {
    function ReferencePropertyImpl(innerSchema, innerTargetSchema, key, name, pathToContainment, identifyingProperty, addFunction, getFunction) {
        this.innerSchema = innerSchema;
        this.innerTargetSchema = innerTargetSchema;
        this.key = key;
        this.name = name;
        this.pathToContainment = pathToContainment;
        this.identifyingProperty = identifyingProperty;
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
    ReferencePropertyImpl.prototype.findReferenceTargets = function (rootData) {
        var candidates = this.pathToContainment
            .split('/')
            .reduce(function (prev, cur) {
            if (cur === '#') {
                return prev;
            }
            return prev[cur];
        }, rootData);
        if (!_.isEmpty(candidates)) {
            return core_1.JsonForms.filterObjectsByType(candidates, this.targetSchema.id);
        }
        return [];
    };
    ReferencePropertyImpl.prototype.resolveReference = function (rootData, propertyValue) {
        var _this = this;
        if (_.isEmpty(propertyValue) || _.isEmpty(this.identifyingProperty)) {
            return null;
        }
        // get all objects that could be referenced.
        var candidates = this.findReferenceTargets(rootData);
        // use identifying property to identify the referenced property by the given propertyValue
        var resultList = candidates.filter(function (value) {
            return value[_this.identifyingProperty] === propertyValue;
        });
        if (_.isEmpty(resultList)) {
            return null;
        }
        if (resultList.length > 1) {
            throw Error('There was more than one possible reference target with value \'' + propertyValue
                + '\' in the identifying property \'' + this.identifyingProperty + '\'.');
        }
        return _.first(resultList);
    };
    return ReferencePropertyImpl;
}());
exports.ReferencePropertyImpl = ReferencePropertyImpl;
exports.isContainmentProperty = function (property) {
    return property instanceof ContainmentPropertyImpl;
};
exports.isReferenceProperty = function (property) {
    return property instanceof ReferencePropertyImpl;
};
//# sourceMappingURL=schema.service.js.map
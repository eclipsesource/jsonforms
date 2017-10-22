"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AJV = require("ajv");
var _ = require("lodash");
var actions_1 = require("../actions");
var ajv = new AJV({ allErrors: true, jsonPointers: true, errorDataPath: 'property' });
var validate = function (validator, data) {
    var valid = validator(data);
    if (valid) {
        return [];
    }
    return validator.errors;
};
exports.validationReducer = function (state, action) {
    if (state === void 0) { state = {
        errors: [],
        validator: function () { return true; },
        schema: {}
    }; }
    switch (action.type) {
        // TODO: review use of actions
        case actions_1.INIT:
            return __assign({}, state, { schema: action.schema, validator: ajv.compile(action.schema) });
        case actions_1.VALIDATE:
            var validator = state.validator;
            if (validator === undefined) {
                validator = ajv.compile(state.schema);
            }
            var errors = validate(validator, action.data).map(function (error) {
                error.dataPath = error.dataPath.replace('/', '.').substr(1);
                return error;
            });
            return __assign({}, state, { validator: validator,
                errors: errors });
        default:
            return state;
    }
};
exports.errorAt = function (instancePath) { return function (state) {
    return _.filter(state.errors, function (error) { return error.dataPath === instancePath; });
}; };
//# sourceMappingURL=validation.js.map
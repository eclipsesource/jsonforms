"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AJV = require("ajv");
const _ = require("lodash");
const actions_1 = require("../actions");
const ajv = new AJV({ allErrors: true, jsonPointers: true, errorDataPath: 'property' });
const validate = (validator, data) => {
    const valid = validator(data);
    if (valid) {
        return [];
    }
    return validator.errors;
};
exports.validationReducer = (state = {
        errors: [],
        validator: () => true,
        schema: {}
    }, action) => {
    switch (action.type) {
        // TODO: review use of actions
        case actions_1.INIT:
            return Object.assign({}, state, { schema: action.schema, validator: ajv.compile(action.schema) });
        case actions_1.VALIDATE:
            let validator = state.validator;
            if (validator === undefined) {
                validator = ajv.compile(state.schema);
            }
            const errors = validate(validator, action.data).map(error => {
                error.dataPath = error.dataPath.replace('/', '.').substr(1);
                return error;
            });
            return Object.assign({}, state, { validator,
                errors });
        default:
            return state;
    }
};
exports.errorAt = instancePath => (state) => {
    return _.filter(state.errors, (error) => error.dataPath === instancePath);
};
//# sourceMappingURL=validation.js.map
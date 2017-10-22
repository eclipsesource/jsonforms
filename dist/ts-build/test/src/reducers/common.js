"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_immutable_1 = require("dot-prop-immutable");
const actions_1 = require("../actions");
exports.commonStateReducer = (state = {
        data: {},
        schema: {},
        uischema: {}
    }, action) => {
    switch (action.type) {
        case actions_1.INIT:
            return {
                data: action.data,
                schema: state.schema,
                uischema: state.uischema
            };
        case actions_1.UPDATE_DATA: {
            if (action.path === undefined || action.path === null) {
                return state;
            }
            else if (action.path === '') {
                // empty path is ok
                const result = action.updater(state.data);
                if (result === undefined || result === null) {
                    return {
                        data: state.data,
                        uischema: state.uischema,
                        schema: state.schema
                    };
                }
                return {
                    data: result,
                    uischema: state.uischema,
                    schema: state.schema
                };
            }
            else {
                const currData = dot_prop_immutable_1.get(state.data, action.path);
                const newState = dot_prop_immutable_1.set(state.data, action.path, action.updater(currData));
                return {
                    data: newState,
                    uischema: state.uischema,
                    schema: state.schema
                };
            }
        }
        default:
            return state;
    }
};
exports.extractData = state => state.data;
exports.extractSchema = state => state.schema;
exports.extractUiSchema = state => state.uischema;
//# sourceMappingURL=common.js.map
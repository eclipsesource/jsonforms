"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dot_prop_immutable_1 = require("dot-prop-immutable");
var actions_1 = require("../actions");
exports.commonStateReducer = function (state, action) {
    if (state === void 0) { state = {
        data: {},
        schema: {},
        uischema: {}
    }; }
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
                var result = action.updater(state.data);
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
                var currData = dot_prop_immutable_1.get(state.data, action.path);
                var newState = dot_prop_immutable_1.set(state.data, action.path, action.updater(currData));
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
exports.extractData = function (state) { return state.data; };
exports.extractSchema = function (state) { return state.schema; };
exports.extractUiSchema = function (state) { return state.uischema; };
//# sourceMappingURL=common.js.map
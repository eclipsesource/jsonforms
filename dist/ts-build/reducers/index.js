"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var validation_1 = require("./validation");
var renderers_1 = require("./renderers");
var common_1 = require("./common");
exports.appReducer = redux_1.combineReducers({
    'common': common_1.commonStateReducer,
    'validation': validation_1.validationReducer,
    'renderers': renderers_1.rendererReducer
});
exports.getData = function (state) {
    return common_1.extractData(state.common);
};
exports.getSchema = function (state) { return common_1.extractSchema(state.common); };
exports.getUiSchema = function (state) { return common_1.extractUiSchema(state.common); };
exports.getRuntime = function (state) { return state.runtime; };
exports.getValidation = function (state) { return state.validation; };
//# sourceMappingURL=index.js.map
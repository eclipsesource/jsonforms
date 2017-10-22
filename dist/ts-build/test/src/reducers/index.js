"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const validation_1 = require("./validation");
const renderers_1 = require("./renderers");
const common_1 = require("./common");
exports.appReducer = redux_1.combineReducers({
    'common': common_1.commonStateReducer,
    'validation': validation_1.validationReducer,
    'renderers': renderers_1.rendererReducer
});
exports.getData = state => {
    return common_1.extractData(state.common);
};
exports.getSchema = state => common_1.extractSchema(state.common);
exports.getUiSchema = state => common_1.extractUiSchema(state.common);
exports.getRuntime = state => state.runtime;
exports.getValidation = state => state.validation;
//# sourceMappingURL=index.js.map
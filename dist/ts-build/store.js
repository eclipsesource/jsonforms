"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_thunk_1 = require("redux-thunk");
var index_1 = require("./reducers/index");
var redux_1 = require("redux");
var core_1 = require("./core");
var actions_1 = require("./actions");
exports.createJsonFormsStore = function (initialState) {
    // TODO: typing
    var store = redux_1.createStore(index_1.appReducer, initialState, redux_1.applyMiddleware(redux_thunk_1.default));
    return store;
};
exports.initJsonFormsStore = function (data, schema, uischema) {
    var store = exports.createJsonFormsStore({
        common: {
            data: data
        },
        renderers: core_1.JsonForms.renderers
    });
    store.dispatch({
        type: actions_1.INIT,
        data: data,
        schema: schema,
        uischema: uischema
    });
    store.dispatch({
        type: actions_1.VALIDATE,
        data: data
    });
    return store;
};
//# sourceMappingURL=store.js.map
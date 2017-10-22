"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_thunk_1 = require("redux-thunk");
const index_1 = require("./reducers/index");
const redux_1 = require("redux");
const core_1 = require("./core");
const actions_1 = require("./actions");
exports.createJsonFormsStore = (initialState) => {
    // TODO: typing
    const store = redux_1.createStore(index_1.appReducer, initialState, redux_1.applyMiddleware(redux_thunk_1.default));
    return store;
};
exports.initJsonFormsStore = (data, schema, uischema) => {
    const store = exports.createJsonFormsStore({
        common: {
            data
        },
        renderers: core_1.JsonForms.renderers
    });
    store.dispatch({
        type: actions_1.INIT,
        data,
        schema,
        uischema
    });
    store.dispatch({
        type: actions_1.VALIDATE,
        data
    });
    return store;
};
//# sourceMappingURL=store.js.map
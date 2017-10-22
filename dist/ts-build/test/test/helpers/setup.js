"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jsdom-global/register");
const installCE = require("document-register-element/pony");
installCE(global, 'force');
const actions_1 = require("../../src/actions");
const store_1 = require("../../src/store");
require("../../src/renderers");
const core_1 = require("../../src/core");
exports.dispatchInputEvent = (input) => {
    const evt = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    input.dispatchEvent(evt);
};
exports.initJsonFormsStore = (data, schema, uischema) => {
    const store = store_1.createJsonFormsStore({
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
    return store;
};
//# sourceMappingURL=setup.js.map
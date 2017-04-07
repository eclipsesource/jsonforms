"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
require("jsdom-global/register");
var installCE = require("document-register-element/pony");
installCE(global);
var json_forms_1 = require("../src/json-forms");
require("../src/renderers/renderers");
ava_1.default.skip('jsonforms gets renderer', function (t) {
    var body = document.getElementsByTagName('body')[0];
    var jsonForms = new json_forms_1.JsonForms();
    jsonForms.data = { name: 'foo' };
    jsonForms.id = 'bar';
    body.appendChild(jsonForms);
    jsonForms.connectedCallback();
    var fromDoc = document.getElementById('bar');
    console.log('innerHTML' + fromDoc.outerHTML);
    t.is(fromDoc, jsonForms);
});
//# sourceMappingURL=json-forms.test.js.map
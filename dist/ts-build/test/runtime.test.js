"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var runtime_1 = require("../src/core/runtime");
ava_1.test('Runtime accessor enabled ', function (t) {
    var runtime = new runtime_1.Runtime();
    runtime.enabled = true;
    t.is(runtime.enabled, true);
    runtime.enabled = false;
    t.is(runtime.enabled, false);
});
ava_1.test('Runtime accessor visible ', function (t) {
    var runtime = new runtime_1.Runtime();
    runtime.visible = true;
    t.is(runtime.visible, true);
    runtime.visible = false;
    t.is(runtime.visible, false);
});
ava_1.test('Runtime accessor validationErrors ', function (t) {
    var runtime = new runtime_1.Runtime();
    t.is(runtime.validationErrors, undefined);
    var ab = ['a', 'b'];
    runtime.validationErrors = ab;
    t.is(runtime.validationErrors, ab);
});
ava_1.test('Runtime enabled notifies listener', function (t) {
    var runtime = new runtime_1.Runtime();
    t.plan(1);
    var listener = {
        notify: function (type) {
            t.is(type, runtime_1.RUNTIME_TYPE.ENABLED);
        }
    };
    runtime.addListener(listener);
    runtime.enabled = true;
});
ava_1.test('Runtime visible notifies listener', function (t) {
    var runtime = new runtime_1.Runtime();
    t.plan(1);
    var listener = {
        notify: function (type) {
            t.is(type, runtime_1.RUNTIME_TYPE.VISIBLE);
        }
    };
    runtime.addListener(listener);
    runtime.visible = true;
});
ava_1.test('Runtime validationErrors notifies listener', function (t) {
    var runtime = new runtime_1.Runtime();
    t.plan(1);
    var listener = {
        notify: function (type) {
            t.is(type, runtime_1.RUNTIME_TYPE.VALIDATION_ERROR);
        }
    };
    runtime.addListener(listener);
    runtime.validationErrors = ['a', 'b'];
});
ava_1.test('Runtime enabled does not notify removed listener', function (t) {
    var runtime = new runtime_1.Runtime();
    t.plan(0);
    var listener = {
        notify: function (type) {
            t.fail();
        }
    };
    runtime.addListener(listener);
    runtime.removeListener(listener);
    runtime.enabled = true;
});
ava_1.test('Runtime visible does not notify removed listener', function (t) {
    var runtime = new runtime_1.Runtime();
    t.plan(0);
    var listener = {
        notify: function (type) {
            t.fail();
        }
    };
    runtime.addListener(listener);
    runtime.removeListener(listener);
    runtime.visible = true;
});
ava_1.test('Runtime validationErrors does not notify removed listener', function (t) {
    var runtime = new runtime_1.Runtime();
    t.plan(0);
    var listener = {
        notify: function (type) {
            t.fail();
        }
    };
    runtime.addListener(listener);
    runtime.removeListener(listener);
    runtime.validationErrors = ['a', 'b'];
});
//# sourceMappingURL=runtime.test.js.map
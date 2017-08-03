"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const runtime_1 = require("../src/core/runtime");
ava_1.test('Enable Runtime', t => {
    const runtime = new runtime_1.Runtime();
    runtime.enabled = true;
    t.is(runtime.enabled, true);
    runtime.enabled = false;
    t.is(runtime.enabled, false);
});
ava_1.test('Show Runtime ', t => {
    const runtime = new runtime_1.Runtime();
    runtime.visible = true;
    t.is(runtime.visible, true);
    runtime.visible = false;
    t.is(runtime.visible, false);
});
ava_1.test('Set Runtime validation errors ', t => {
    const runtime = new runtime_1.Runtime();
    t.is(runtime.validationErrors, undefined);
    const ab = ['a', 'b'];
    runtime.validationErrors = ab;
    t.is(runtime.validationErrors, ab);
});
ava_1.test('Enabling Runtime notifies runtime listener', t => {
    const runtime = new runtime_1.Runtime();
    t.plan(1);
    const listener = {
        runtimeUpdated(type) {
            t.is(type, runtime_1.RUNTIME_TYPE.ENABLED);
        }
    };
    runtime.registerRuntimeListener(listener);
    runtime.enabled = true;
});
ava_1.test('Showing Runtime notifies runtime listener', t => {
    const runtime = new runtime_1.Runtime();
    t.plan(1);
    const listener = {
        runtimeUpdated(type) {
            t.is(type, runtime_1.RUNTIME_TYPE.VISIBLE);
        }
    };
    runtime.registerRuntimeListener(listener);
    runtime.visible = true;
});
ava_1.test('Setting Runtime validation errors notifies runtime listener', t => {
    const runtime = new runtime_1.Runtime();
    t.plan(1);
    const listener = {
        runtimeUpdated(type) {
            t.is(type, runtime_1.RUNTIME_TYPE.VALIDATION_ERROR);
        }
    };
    runtime.registerRuntimeListener(listener);
    runtime.validationErrors = ['a', 'b'];
});
ava_1.test('Enabling Runtime does not notify de-registered runtime listener', t => {
    const runtime = new runtime_1.Runtime();
    t.plan(0);
    const listener = {
        runtimeUpdated(type) {
            t.fail();
        }
    };
    runtime.registerRuntimeListener(listener);
    runtime.deregisterRuntimeListener(listener);
    runtime.enabled = true;
});
ava_1.test('Showing Runtime does not notify de-registered runtime listener', t => {
    const runtime = new runtime_1.Runtime();
    t.plan(0);
    const listener = {
        runtimeUpdated(type) {
            t.fail();
        }
    };
    runtime.registerRuntimeListener(listener);
    runtime.deregisterRuntimeListener(listener);
    runtime.visible = true;
});
ava_1.test('Setting Runtime validation errors does not notify de-registered runtime listener', t => {
    const runtime = new runtime_1.Runtime();
    t.plan(0);
    const listener = {
        runtimeUpdated(type) {
            t.fail();
        }
    };
    runtime.registerRuntimeListener(listener);
    runtime.deregisterRuntimeListener(listener);
    runtime.validationErrors = ['a', 'b'];
});
//# sourceMappingURL=runtime.test.js.map
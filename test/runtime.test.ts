import {test} from 'ava';
import {Runtime, RUNTIME_TYPE, RuntimeListener} from '../src/core/runtime';

test('Enable Runtime', t => {
  const runtime = new Runtime();
  runtime.enabled = true;
  t.is(runtime.enabled, true);
  runtime.enabled = false;
  t.is(runtime.enabled, false);
});
test('Show Runtime ', t => {
  const runtime = new Runtime();
  runtime.visible = true;
  t.is(runtime.visible, true);
  runtime.visible = false;
  t.is(runtime.visible, false);
});
test('Set Runtime validation errors ', t => {
  const runtime = new Runtime();
  t.is(runtime.validationErrors, undefined);
  const ab = ['a', 'b'];
  runtime.validationErrors = ab;
  t.is(runtime.validationErrors, ab);
});
test('Enabling Runtime notifies runtime listener', t => {
  const runtime = new Runtime();
  t.plan(1);
  const listener: RuntimeListener = {
    runtimeUpdated(type: RUNTIME_TYPE): void {
      t.is(type, RUNTIME_TYPE.ENABLED);
    }
  };
  runtime.registerRuntimeListener(listener);
  runtime.enabled = true;
});
test('Showing Runtime notifies runtime listener', t => {
  const runtime = new Runtime();
  t.plan(1);
  const listener: RuntimeListener = {
    runtimeUpdated(type: RUNTIME_TYPE): void {
      t.is(type, RUNTIME_TYPE.VISIBLE);
    }
  };
  runtime.registerRuntimeListener(listener);
  runtime.visible = true;
});
test('Setting Runtime validation errors notifies runtime listener', t => {
  const runtime = new Runtime();
  t.plan(1);
  const listener: RuntimeListener = {
    runtimeUpdated(type: RUNTIME_TYPE): void {
      t.is(type, RUNTIME_TYPE.VALIDATION_ERROR);
    }
  };
  runtime.registerRuntimeListener(listener);
  runtime.validationErrors = ['a', 'b'];
});
test('Enabling Runtime does not notify de-registered runtime listener', t => {
  const runtime = new Runtime();
  t.plan(0);
  const listener: RuntimeListener = {
    runtimeUpdated(type: RUNTIME_TYPE): void {
      t.fail();
    }
  };
  runtime.registerRuntimeListener(listener);
  runtime.deregisterRuntimeListener(listener);
  runtime.enabled = true;
});
test('Showing Runtime does not notify de-registered runtime listener', t => {
  const runtime = new Runtime();
  t.plan(0);
  const listener: RuntimeListener = {
    runtimeUpdated(type: RUNTIME_TYPE): void {
      t.fail();
    }
  };
  runtime.registerRuntimeListener(listener);
  runtime.deregisterRuntimeListener(listener);
  runtime.visible = true;
});
test('Setting Runtime validation errors does not notify de-registered runtime listener', t => {
  const runtime = new Runtime();
  t.plan(0);
  const listener: RuntimeListener = {
    runtimeUpdated(type: RUNTIME_TYPE): void {
      t.fail();
    }
  };
  runtime.registerRuntimeListener(listener);
  runtime.deregisterRuntimeListener(listener);
  runtime.validationErrors = ['a', 'b'];
});

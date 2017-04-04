import {test} from 'ava';
import {Runtime, RUNTIME_TYPE, RuntimeListener} from '../src/core/runtime';

test('Runtime accessor enabled ', t => {
  const runtime = new Runtime();
  runtime.enabled = true;
  t.is(runtime.enabled, true);
  runtime.enabled = false;
  t.is(runtime.enabled, false);
});
test('Runtime accessor visible ', t => {
  const runtime = new Runtime();
  runtime.visible = true;
  t.is(runtime.visible, true);
  runtime.visible = false;
  t.is(runtime.visible, false);
});
test('Runtime accessor validationErrors ', t => {
  const runtime = new Runtime();
  t.is(runtime.validationErrors, undefined);
  const ab = ['a', 'b'];
  runtime.validationErrors = ab;
  t.is(runtime.validationErrors, ab);
});
test('Runtime enabled notifies listener', t => {
  const runtime = new Runtime();
  t.plan(1);
  const listener: RuntimeListener = {
    notify(type: RUNTIME_TYPE): void {
      t.is(type, RUNTIME_TYPE.ENABLED);
    }
  }
  runtime.addListener(listener);
  runtime.enabled = true;
});
test('Runtime visible notifies listener', t => {
  const runtime = new Runtime();
  t.plan(1);
  const listener: RuntimeListener = {
    notify(type: RUNTIME_TYPE): void {
      t.is(type, RUNTIME_TYPE.VISIBLE);
    }
  }
  runtime.addListener(listener);
  runtime.visible = true;
});
test('Runtime validationErrors notifies listener', t => {
  const runtime = new Runtime();
  t.plan(1);
  const listener: RuntimeListener = {
    notify(type: RUNTIME_TYPE): void {
      t.is(type, RUNTIME_TYPE.VALIDATION_ERROR);
    }
  }
  runtime.addListener(listener);
  runtime.validationErrors = ['a', 'b'];
});
test('Runtime enabled does not notify removed listener', t => {
  const runtime = new Runtime();
  t.plan(0);
  const listener: RuntimeListener = {
    notify(type: RUNTIME_TYPE): void {
      t.fail();
    }
  }
  runtime.addListener(listener);
  runtime.removeListener(listener);
  runtime.enabled = true;
});
test('Runtime visible does not notify removed listener', t => {
  const runtime = new Runtime();
  t.plan(0);
  const listener: RuntimeListener = {
    notify(type: RUNTIME_TYPE): void {
      t.fail();
    }
  }
  runtime.addListener(listener);
  runtime.removeListener(listener);
  runtime.visible = true;
});
test('Runtime validationErrors does not notify removed listener', t => {
  const runtime = new Runtime();
  t.plan(0);
  const listener: RuntimeListener = {
    notify(type: RUNTIME_TYPE): void {
      t.fail();
    }
  }
  runtime.addListener(listener);
  runtime.removeListener(listener);
  runtime.validationErrors = ['a', 'b'];
});

import test from 'ava';
import {
  isBooleanControl,
  isDateControl,
  isEnumControl,
  isIntegerControl,
  isMultiLineControl,
  isNumberControl,
  isStringControl,
  isTimeControl
} from '../src/core/testers';
import { JsonSchema } from '../src/models/jsonSchema';
import { context.LabelElement.t, uischema } from '../src/models/uischema';
test.beforeEach(t => {
  t.context.uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
});

test('test isBooleanControl', t => {
  t.false(isBooleanControl(undefined, undefined));
  t.false(isBooleanControl(null, undefined));
  t.false(isBooleanControl({ type: 'Foo' }, undefined));
  t.false(isBooleanControl({ type: 'Control' }, undefined));
  t.false(
    isBooleanControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  t.false(
    isBooleanControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'boolean' } } }
    )
  );
  t.true(
    isBooleanControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'boolean' } } }
    )
  );
});

test('test isDateControl', t => {
  t.false(isDateControl(undefined, undefined));
  t.false(isDateControl(null, undefined));
  t.false(isDateControl({ type: 'Foo' }, undefined));
  t.false(isDateControl({ type: 'Control' }, undefined));
  t.false(
    isDateControl(
      t.context.uischmea,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  t.false(
    isDateControl(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'date',
          }
        }
      }
    )
  );
  t.true(
    isDateControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string', format: 'date' } } }
    )
  );
});
test('test isEnumControl', t => {
  t.false(isEnumControl(undefined, undefined));
  t.false(isEnumControl(null, undefined));
  t.false(isEnumControl({ type: 'Foo' }, undefined));
  t.false(isEnumControl({ type: 'Control' }, undefined));
  t.false(
    isEnumControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  t.false(
    isEnumControl(
      t.context.uischema,
      {
        'type': 'object',
        'properties': {
          'foo': {
            'type': 'string'
          },
          'bar': {
            'type': 'string',
            'enum': ['a', 'b']
          }
        }
      }
    )
  );
  t.true(
    isEnumControl(
      t.context.uischema,
      { 'type': 'object', 'properties': { 'foo': { 'type': 'string', 'enum': ['a', 'b'] } } }
    )
  );
  // TODO should this be true?
  t.true(
    isEnumControl(
      t.context.uischema,
      { 'type': 'object', 'properties': { 'foo': { 'type': 'number', 'enum': [1, 2] } } }
    )
  );
});
test('test isIntegerControl', t => {
  t.false(isIntegerControl(undefined, undefined));
  t.false(isIntegerControl(null, undefined));
  t.false(isIntegerControl({ type: 'Foo' }, undefined));
  t.false(isIntegerControl({ type: 'Control' }, undefined));
  t.false(
    isIntegerControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  t.false(
    isIntegerControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'integer' } } }
    )
  );
  t.true(
    isIntegerControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'integer' } } })
  );
});
test('test isNumberControl', t => {
  t.false(isNumberControl(undefined, undefined));
  t.false(isNumberControl(null, undefined));
  t.false(isNumberControl({ type: 'Foo' }, undefined));
  t.false(isNumberControl({ type: 'Control' }, undefined));
  t.false(
    isNumberControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  t.false(
    isNumberControl(
      t.context.uischema,
      {
        type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'number' } }
      }
    )
  );
  t.true(
    isNumberControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'number' } } }
    )
  );
});
test('tester isStringControl', t => {
  t.false(isStringControl(undefined, undefined));
  t.false(isStringControl(null, undefined));
  t.false(isStringControl({ type: 'Foo' }, undefined));
  t.false(isStringControl({ type: 'Control' }, undefined));
  t.false(
    isStringControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'number' } } }
    )
  );
  t.false(
    isStringControl(
      t.context.uischema,
      {
        type: 'object', properties: { foo: { type: 'number' }, bar: { type: 'string' } }
      }
    )
  );
  t.true(
    isStringControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
});
test('test isTimeControl', t => {
  t.false(isTimeControl(undefined, undefined));
  t.false(isTimeControl(null, undefined));
  t.false(isTimeControl({ type: 'Foo' }, undefined));
  t.false(isTimeControl({ type: 'Control' }, undefined));
  t.false(
    isTimeControl(
      t.context.uischmea,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  t.false(
    isTimeControl(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string', format: 'time' }
        }
      }
    )
  );
  t.true(
    isTimeControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string', format: 'time' } } }
    )
  );
});
test('tester isMultiLineControl', t => {
  t.false(isMultiLineControl(undefined, undefined));
  t.false(isMultiLineControl(null, undefined));
  t.false(isMultiLineControl({ type: 'Foo' }, undefined));
  t.false(isMultiLineControl({ type: 'Control' }, undefined));
  t.false(
    isStringControl(
      t.context.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
  const control = t.context.uischema;
  control.options = { multi: true };
  t.true(
    isMultiLineControl(
      control,
      { type: 'object', properties: { foo: { type: 'string' } } }
    )
  );
});

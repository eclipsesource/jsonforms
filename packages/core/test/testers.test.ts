import test from 'ava';
import {
  and,
  formatIs,
  isArrayObjectControl,
  optionIs,
  or,
  refEndIs,
  refEndsWith,
  schemaMatches,
  schemaTypeIs,
  uiTypeIs
} from '../src/testers';
import { JsonSchema } from '../src/models/jsonSchema';
import { ControlElement, LabelElement } from '../src/models/uischema';

test('schemaTypeIs should check type sub-schema of control', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.true(schemaTypeIs('string')(uischema, schema));
  t.false(schemaTypeIs('integer')(uischema, schema));
});

test('schemaTypeIs should return false for non-control UI schema elements', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(schemaTypeIs('integer')(label, schema));
});

test('schemaTypeIs should return false for control pointing to invalid sub-schema', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    }
  };
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  t.false(schemaTypeIs('string')(uischema, schema));
});

test('formatIs should check the format of a resolved sub-schema', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        format: 'date-time'
      }
    }
  };
  t.true(formatIs('date-time')(uischema, schema));
});

test('uiTypeIs', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    }
  };
  t.true(uiTypeIs('Control')(control, undefined));
});

test('optionIs should check for options', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    },
    options: {
      answer: 42
    }
  };
  t.true(optionIs('answer', 42)(control, undefined));
});

test('optionIs should return false for UI schema elements without options field', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    }
  };
  t.false(optionIs('answer', 42)(control, undefined));
});

test('schemaMatches should check type sub-schema of control via predicate', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.true(schemaMatches(subSchema => subSchema.type === 'string')(uischema, schema));
});

test('schemaMatches should return false for non-control UI schema elements', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(schemaMatches(() => false)(label, schema));
});

test('schemaMatches should return false for control pointing to invalid subschema', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    }
  };
  t.false(schemaMatches(() => false)(uischema, schema));
});

test('refEndsWith checks whether the ref of a control ends with a certain string', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    }
  };
  t.true(refEndsWith('properties/bar')(uischema, undefined));
});

test('refEndsWith should return false for non-control UI schema elements', t => {
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(refEndsWith('properties/bar')(label, undefined));
});

test('refEndIs checks whether the last segment a control ref equals a certain string', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/bar'
    }
  };
  t.true(refEndIs('bar')(uischema, undefined));
});

test('refEndIs should return false for non-control UI schema elements', t => {
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(refEndIs('bar')(label, undefined));
});

test('and should allow to compose multiple testers', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.true(and(
    schemaTypeIs('string'),
    refEndIs('foo')
  )(uischema, schema));
});

test('or should allow to compose multiple testers', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'integer' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.true(or(
    schemaTypeIs('integer'),
    optionIs('slider', true)
  )(uischema, schema));
});
test('tester isArrayObjectControl', t => {
  t.false(isArrayObjectControl({type: 'Foo'}, null));
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.false(isArrayObjectControl(control, undefined), 'No Schema not checked!');

  t.false(
    isArrayObjectControl(
      control,
      {type: 'object', properties: {bar: {type: 'integer'}}}
    ),
    'Wrong Schema Type not checked!'
  );
  t.false(
    isArrayObjectControl(
      control,
      {type: 'object', properties: {foo: {type: 'array'}}}
    ),
    'Array Schema Type without items not checked!'
  );
  t.false(
    isArrayObjectControl(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: [
              {type: 'integer'},
              {type: 'string'},
            ]
          }
        }
      }
    ),
    'Array Schema Type with tuples not checked!'
  );
  t.false(
    isArrayObjectControl(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: {type: 'integer'}
          }
        }
      }
    ),
    'Array Schema Type with wrong item type not checked!'
  );
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: {type: 'integer'},
            y: {type: 'integer'}
          }
        }
      }
    }
  };
  t.true(isArrayObjectControl(control, schema));
});

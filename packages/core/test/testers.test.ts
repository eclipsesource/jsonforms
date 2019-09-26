/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import anyTest, { TestInterface } from 'ava';
import RefParser from 'json-schema-ref-parser';
import {
  and,
  formatIs,
  isBooleanControl,
  isDateControl,
  isEnumControl,
  isIntegerControl,
  isMultiLineControl,
  isNumberControl,
  isObjectArrayControl,
  isObjectArrayWithNesting,
  isPrimitiveArrayControl,
  isStringControl,
  isTimeControl,
  not,
  optionIs,
  or,
  schemaMatches,
  schemaSubPathMatches,
  schemaTypeIs,
  scopeEndIs,
  scopeEndsWith,
  uiTypeIs
} from '../src/testers';
import {
  ControlElement,
  JsonSchema,
  LabelElement,
  UISchemaElement
} from '../src';
import cloneDeep from 'lodash/cloneDeep';

const test = anyTest as TestInterface<{ uischema: ControlElement }>;
const resolveRef = (jsonSchema: any) => async (pointer: string): Promise<JsonSchema> => {
  const parser = new RefParser();
  try {
    const refs = await parser
      .resolve(cloneDeep(jsonSchema), {
        dereference: { circular: 'ignore' }
      })
    return refs.get(pointer) as JsonSchema;
  } catch (error) {
    return undefined;
  }
};

test.beforeEach(t => {
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
});

test('schemaTypeIs should check type sub-schema of control', async t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.true(await schemaTypeIs('string')(uischema, schema, resolveRef(schema)));
  t.false(await schemaTypeIs('integer')(uischema, schema, resolveRef(schema)));
});

test('schemaTypeIs should return false for non-control UI schema elements', async t => {
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
  t.false(await schemaTypeIs('integer')(label, schema, resolveRef(schema)));
});

test('schemaTypeIs should return false for control pointing to invalid sub-schema', async t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  t.false(await schemaTypeIs('string')(uischema, schema, resolveRef(schema)));
});

test('schemaTypeIs should return true for array type', async t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: ['string', 'integer'] }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.true(await schemaTypeIs('string')(uischema, schema, resolveRef(schema)));
  t.true(await schemaTypeIs('integer')(uischema, schema, resolveRef(schema)));
});

test('formatIs should check the format of a resolved sub-schema', async t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
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
  t.true(await formatIs('date-time')(uischema, schema, resolveRef(schema)));
});

test('uiTypeIs', async t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.true(await uiTypeIs('Control')(control, undefined));
});

test('optionIs should check for options', async t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar',
    options: {
      answer: 42
    }
  };
  t.true(await optionIs('answer', 42)(control, undefined, resolveRef(control)));
});

test('optionIs should not fail if uischema is undefined or null', async t => {
  const uischema: UISchemaElement = null;
  t.false(await optionIs('answer', 42)(uischema, undefined));
  t.false(await optionIs('answer', 42)(uischema, undefined));
});

test('optionIs should return false for UI schema elements without options cell', async t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.false(await optionIs('answer', 42)(control, undefined));
});

test('schemaMatches should check type sub-schema of control via predicate', async t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.true(
    await schemaMatches(subSchema => subSchema.type === 'string')(
      uischema,
      schema,
      resolveRef(schema)
    )
  );
});

test('schemaMatches should check type sub-schema of control via predicate also without explicit type', async t => {
  const schema: JsonSchema = {
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.true(
    await schemaMatches(subSchema => subSchema.type === 'string')(
      uischema,
      schema,
      resolveRef(schema)
    )
  );
});

test('schemaMatches should return false for non-control UI schema elements', async t => {
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
  t.false(await schemaMatches(() => false)(label, schema, resolveRef(schema)));
});

test('schemaMatches should return false for control pointing to invalid subschema', async t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.false(
    await schemaMatches(() => false)(uischema, schema, resolveRef(schema))
  );
});

test('scopeEndsWith checks whether the ref of a control ends with a certain string', async t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.true(await scopeEndsWith('properties/bar')(uischema, undefined));
});

test('scopeEndsWith should return false for non-control UI schema elements', async t => {
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(await scopeEndsWith('properties/bar')(label, undefined));
});

test('scopeEndsIs checks whether the last segment a control ref equals a certain string', async t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.true(await scopeEndIs('bar')(uischema, undefined));
});

test('scopeEndIs should return false for non-control UI schema elements', async t => {
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(await scopeEndIs('bar')(label, undefined));
});

test('and should allow to compose multiple testers', async t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.true(
    await and(schemaTypeIs('string'), scopeEndIs('foo'))(
      uischema,
      schema,
      resolveRef(schema)
    )
  );
});

test('or should allow to compose multiple testers', async t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: { type: 'integer' }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.true(
    await or(schemaTypeIs('integer'), optionIs('slider', true))(
      uischema,
      schema,
      resolveRef(schema)
    )
  );
});

test('tester isPrimitiveArrayControl', async t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: { type: 'integer' }
      }
    }
  };
  t.true(
    await isPrimitiveArrayControl(control, schema, resolveRef(schema)),
    `Primitive array tester was not triggered for 'integer' schema type`
  );
  const jsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: { type: 'object' }
      }
    }
  };
  t.false(
    await isPrimitiveArrayControl(control, jsonSchema, resolveRef(jsonSchema)),
    `Primitive array tester was not triggered for 'object' schema type`
  );
});

test('tester isObjectArrayControl', async t => {
  t.false(await isObjectArrayControl({ type: 'Foo' }, null));
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.false(
    await isObjectArrayControl(control, undefined),
    'No Schema not checked!'
  );

  t.false(
    await isObjectArrayControl(
      control,
      {
        type: 'object',
        properties: { bar: { type: 'integer' } }
      }
    ),
    'Wrong Schema Type not checked!'
  );
  t.false(
    await isObjectArrayControl(
      control,
      {
        type: 'object',
        properties: { foo: { type: 'array' } }
      }
    ),
    'Array Schema Type without items not checked!'
  );
  t.false(
    await isObjectArrayControl(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: [{ type: 'integer' }, { type: 'string' }]
          }
        }
      }
    ),
    'Array Schema Type with tuples not checked!'
  );
  t.false(
    await isObjectArrayControl(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: { type: 'integer' }
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
            x: { type: 'integer' },
            y: { type: 'integer' }
          }
        }
      }
    }
  };
  t.true(await isObjectArrayControl(control, schema, resolveRef(schema)));
  const schema_noType: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        items: {
          type: 'object',
          properties: {
            x: { type: 'integer' },
            y: { type: 'integer' }
          }
        }
      }
    }
  };
  t.true(
    await isObjectArrayControl(
      control,
      schema_noType,
      resolveRef(schema_noType)
    )
  );
  const schema_innerAllOf: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: {
          allOf: [
            {
              properties: {
                x: { type: 'integer' }
              }
            },
            {
              properties: {
                y: { type: 'integer' }
              }
            }
          ]
        }
      }
    }
  };
  t.true(
    await isObjectArrayControl(
      control,
      schema_innerAllOf,
      resolveRef(schema_innerAllOf)
    )
  );
});

test('isBooleanControl', async t => {
  t.false(await isBooleanControl(undefined, undefined));
  t.false(await isBooleanControl(null, undefined));
  t.false(await isBooleanControl({ type: 'Foo' }, undefined));
  t.false(await isBooleanControl({ type: 'Control' }, undefined));
  t.false(
    await isBooleanControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  t.false(
    await isBooleanControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' }, bar: { type: 'boolean' } }
      }
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'boolean' } }
  };
  t.true(
    await isBooleanControl(t.context.uischema, schema, resolveRef(schema))
  );
});

test('test isDateControl', async t => {
  t.false(await isDateControl(undefined, undefined));
  t.false(await isDateControl(null, undefined));
  t.false(await isDateControl({ type: 'Foo' }, undefined));
  t.false(await isDateControl({ type: 'Control' }, undefined));
  t.false(
    await isDateControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  t.false(
    await isDateControl(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'date'
          }
        }
      }
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'string', format: 'date' } }
  };
  t.true(await isDateControl(t.context.uischema, schema, resolveRef(schema)));
});
test('test isEnumControl', async t => {
  t.false(await isEnumControl(undefined, undefined));
  t.false(await isEnumControl(null, undefined));
  t.false(await isEnumControl({ type: 'Foo' }, undefined));
  t.false(await isEnumControl({ type: 'Control' }, undefined));
  t.false(
    await isEnumControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  t.false(
    await isEnumControl(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'string',
            enum: ['a', 'b']
          }
        }
      }
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'string', enum: ['a', 'b'] } }
  };
  t.true(await isEnumControl(t.context.uischema, schema, resolveRef(schema)));
  const validSchema = {
    type: 'object',
    properties: { foo: { type: 'number', enum: [1, 2] } }
  };
  t.true(
    await isEnumControl(
      t.context.uischema,
      validSchema,
      resolveRef(validSchema)
    )
  );
  const validSchema2 = {
    type: 'object',
    properties: { foo: { const: '1.0' } }
  };
  t.true(
    await isEnumControl(
      t.context.uischema,
      validSchema2,
      resolveRef(validSchema2)
    )
  );
});
test('test isIntegerControl', async t => {
  t.false(await isIntegerControl(undefined, undefined));
  t.false(await isIntegerControl(null, undefined));
  t.false(await isIntegerControl({ type: 'Foo' }, undefined));
  t.false(await isIntegerControl({ type: 'Control' }, undefined));
  t.false(
    await isIntegerControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  const incorrectSchema = {
    type: 'object',
    properties: { foo: { type: 'string' }, bar: { type: 'integer' } }
  };
  t.false(
    await isIntegerControl(
      t.context.uischema,
      incorrectSchema,
      resolveRef(incorrectSchema)
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'integer' } }
  };
  t.true(
    await isIntegerControl(t.context.uischema, schema, resolveRef(schema))
  );
});

test('test isNumberControl', async t => {
  t.false(await isNumberControl(undefined, undefined));
  t.false(await isNumberControl(null, undefined));
  t.false(await isNumberControl({ type: 'Foo' }, undefined));
  t.false(await isNumberControl({ type: 'Control' }, undefined));
  t.false(
    await isNumberControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  const incorrectSchema = {
    type: 'object',
    properties: { foo: { type: 'string' }, bar: { type: 'number' } }
  };
  t.false(
    await isNumberControl(
      t.context.uischema,
      incorrectSchema,
      resolveRef(incorrectSchema)
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'number' } }
  };
  t.true(await isNumberControl(t.context.uischema, schema, resolveRef(schema)));
});
test('tester isStringControl', async t => {
  t.false(await isStringControl(undefined, undefined));
  t.false(await isStringControl(null, undefined));
  t.false(await isStringControl({ type: 'Foo' }, undefined));
  t.false(await isStringControl({ type: 'Control' }, undefined));
  t.false(
    await isStringControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'number' } }
      }
    )
  );
  const incorrectSchema = {
    type: 'object',
    properties: { foo: { type: 'number' }, bar: { type: 'string' } }
  };
  t.false(
    await isStringControl(
      t.context.uischema,
      incorrectSchema,
      resolveRef(incorrectSchema)
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'string' } }
  };
  t.true(await isStringControl(t.context.uischema, schema, resolveRef(schema)));
});
test('test isTimeControl', async t => {
  t.false(await isTimeControl(undefined, undefined));
  t.false(await isTimeControl(null, undefined));
  t.false(await isTimeControl({ type: 'Foo' }, undefined));
  t.false(await isTimeControl({ type: 'Control' }, undefined));
  t.false(
    await isTimeControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  const incorrectSchema = {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'string', format: 'time' }
    }
  };
  t.false(
    await isTimeControl(
      t.context.uischema,
      incorrectSchema,
      resolveRef(incorrectSchema)
    )
  );
  const schema = {
    type: 'object',
    properties: { foo: { type: 'string', format: 'time' } }
  };
  t.true(await isTimeControl(t.context.uischema, schema, resolveRef(schema)));
});
test('tester isMultiLineControl', async t => {
  t.false(await isMultiLineControl(undefined, undefined));
  t.false(await isMultiLineControl(null, undefined));
  t.false(await isMultiLineControl({ type: 'Foo' }, undefined));
  t.false(await isMultiLineControl({ type: 'Control' }, undefined));
  t.false(
    await isMultiLineControl(
      t.context.uischema,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
  const control = t.context.uischema;
  control.options = { multi: true };
  t.true(
    await isMultiLineControl(
      control,
      {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }
    )
  );
});

test('tester isObjectArrayWithNesting', async t => {
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          maxLength: 3
        },
        done: {
          type: 'boolean'
        }
      }
    }
  };

  const nestedSchema = {
    type: 'array',
    items: {
      ...schema
    }
  };

  const uischema = {
    type: 'Control',
    scope: '#'
  };

  const nestedSchema2 = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        objectarrayofstrings: {
          type: 'object',
          properties: {
            choices: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  };
  const nestedSchema3 = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        Level2: {
          type: 'object',
          properties: {
            Level3: {
              type: 'string'
            }
          }
        }
      }
    }
  };

  const uischemaOptions: {
    generate: ControlElement;
    default: ControlElement;
    inline: ControlElement;
  } = {
    default: {
      type: 'Control',
      scope: '#',
      options: {
        detail: 'DEFAULT'
      }
    },
    generate: {
      type: 'Control',
      scope: '#',
      options: {
        detail: 'GENERATE'
      }
    },
    inline: {
      type: 'Control',
      scope: '#',
      options: {
        detail: {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/message'
            }
          ]
        }
      }
    }
  };

  t.false(await isObjectArrayWithNesting(undefined, undefined));
  t.false(await isObjectArrayWithNesting(null, undefined));
  t.false(
    await isObjectArrayWithNesting({ type: 'Foo' }, undefined)
  );
  t.false(
    await isObjectArrayWithNesting({ type: 'Control' }, undefined)
  );
  t.false(await isObjectArrayWithNesting(uischema, schema));
  t.true(
    await isObjectArrayWithNesting(
      uischema,
      nestedSchema,
      resolveRef(nestedSchema)
    )
  );
  t.true(
    await isObjectArrayWithNesting(
      uischema,
      nestedSchema2,
      resolveRef(nestedSchema2)
    )
  );
  t.true(
    await isObjectArrayWithNesting(
      uischema,
      nestedSchema3,
      resolveRef(nestedSchema3)
    )
  );

  t.false(
    await isObjectArrayWithNesting(
      uischemaOptions.default,
      schema,
      resolveRef(schema)
    )
  );
  t.true(
    await isObjectArrayWithNesting(
      uischemaOptions.generate,
      schema,
      resolveRef(schema)
    )
  );
  t.true(
    await isObjectArrayWithNesting(
      uischemaOptions.inline,
      schema,
      resolveRef(schema)
    )
  );
});

test('tester schemaSubPathMatches', async t => {
  const schema = {
    title: 'Things',
    type: 'array',
    items: {
      type: 'number'
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  t.true(
    await schemaSubPathMatches('items', async items => items.type === 'number')(
      uischema,
      schema,
      resolveRef(schema)
    )
  );
});

test('tester not', async t => {
  const schema = {
    type: 'boolean'
  };
  t.false(
    await not(isBooleanControl)(t.context.uischema, schema, resolveRef(schema))
  );
});

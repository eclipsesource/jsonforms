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
  uiTypeIs,
  isOneOfEnumControl
} from '../src/testers';
import {
  ControlElement,
  JsonSchema,
  LabelElement,
  UISchemaElement
} from '../src';

const test = anyTest as TestInterface<{ uischema: ControlElement }>;

test.beforeEach(t => {
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
});

test('schemaTypeIs should check type sub-schema of control', t => {
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
  t.true(schemaTypeIs('string')(uischema, schema, schema));
  t.false(schemaTypeIs('integer')(uischema, schema, schema));
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
  t.false(schemaTypeIs('integer')(label, schema, schema));
});

test('schemaTypeIs should return false for control pointing to invalid sub-schema', t => {
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
  t.false(schemaTypeIs('string')(uischema, schema, schema));
});

test('schemaTypeIs should return true for array type', t => {
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
  t.true(schemaTypeIs('string')(uischema, schema, schema));
  t.true(schemaTypeIs('integer')(uischema, schema, schema));
});

test('formatIs should check the format of a resolved sub-schema', t => {
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
  t.true(formatIs('date-time')(uischema, schema, schema));
});

test('uiTypeIs', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.true(uiTypeIs('Control')(control, undefined, undefined));
});

test('optionIs should check for options', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar',
    options: {
      answer: 42
    }
  };
  t.true(optionIs('answer', 42)(control, undefined, undefined));
});

test('optionIs should not fail if uischema is undefined or null', t => {
  const uischema: UISchemaElement = null;
  t.false(optionIs('answer', 42)(uischema, undefined, undefined));
  t.false(optionIs('answer', 42)(uischema, undefined, undefined));
});

test('optionIs should return false for UI schema elements without options cell', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.false(optionIs('answer', 42)(control, undefined, undefined));
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
    scope: '#/properties/foo'
  };
  t.true(
    schemaMatches(subSchema => subSchema.type === 'string')(uischema, schema, schema)
  );
});

test('schemaMatches should check type sub-schema of control via predicate also without explicit type', t => {
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
    schemaMatches(subSchema => subSchema.type === 'string')(uischema, schema, schema)
  );
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
  t.false(schemaMatches(() => false)(label, schema, schema));
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
    scope: '#/properties/bar'
  };
  t.false(schemaMatches(() => false)(uischema, schema, schema));
});

test('scopeEndsWith checks whether the ref of a control ends with a certain string', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.true(scopeEndsWith('properties/bar')(uischema, undefined, undefined));
});

test('scopeEndsWith should return false for non-control UI schema elements', t => {
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(scopeEndsWith('properties/bar')(label, undefined, undefined));
});

test('refEndIs checks whether the last segment a control ref equals a certain string', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/bar'
  };
  t.true(scopeEndIs('bar')(uischema, undefined, undefined));
});

test('refEndIs should return false for non-control UI schema elements', t => {
  const label: LabelElement = {
    type: 'Label',
    text: 'some text'
  };
  t.false(scopeEndIs('bar')(label, undefined, undefined));
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
    scope: '#/properties/foo'
  };
  t.true(and(schemaTypeIs('string'), scopeEndIs('foo'))(uischema, schema, schema));
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
    scope: '#/properties/foo'
  };
  t.true(
    or(schemaTypeIs('integer'), optionIs('slider', true))(uischema, schema, schema)
  );
});

test('tester isPrimitiveArrayControl', t => {
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
    isPrimitiveArrayControl(control, schema, schema),
    `Primitive array tester was not triggered for 'integer' schema type`
  );
  const schemaWithRefs = {
    definitions: { int: { type: 'integer' } },
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: { $ref: '#/definitions/int' }
      }
    }
  };
  t.true(
    isPrimitiveArrayControl(control, schemaWithRefs, schemaWithRefs),
    `Primitive array tester was not triggered for 'integer' schema type with refs`
  );
  const objectSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: { type: 'object' }
      }
    }
  };
  t.false(
    isPrimitiveArrayControl(control, objectSchema, objectSchema),
    `Primitive array tester was not triggered for 'object' schema type`
  );
});

test('tester isObjectArrayControl', t => {
  t.false(isObjectArrayControl({ type: 'Foo' }, null, null));
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.false(isObjectArrayControl(control, undefined, undefined), 'No Schema not checked!');

  t.false(
    isObjectArrayControl(control, {
      type: 'object',
      properties: { bar: { type: 'integer' } }
    }, undefined),
    'Wrong Schema Type not checked!'
  );
  t.false(
    isObjectArrayControl(control, {
      type: 'object',
      properties: { foo: { type: 'array' } }
    }, undefined),
    'Array Schema Type without items not checked!'
  );
  t.false(
    isObjectArrayControl(control, {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: [{ type: 'integer' }, { type: 'string' }]
        }
      }
    }, undefined),
    'Array Schema Type with tuples not checked!'
  );
  t.false(
    isObjectArrayControl(control, {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: { type: 'integer' }
        }
      }
    }, undefined),
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
  t.true(isObjectArrayControl(control, schema, schema));
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
  t.true(isObjectArrayControl(control, schema_noType, schema_noType));
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
  t.true(isObjectArrayControl(control, schema_innerAllOf, schema_innerAllOf));

  const schemaWithRefs = {
    definitions: {
      order: {
        type: 'object',
        properties: {
          x: { type: 'integer' },
          y: { type: 'integer' }
        }
      }
    },
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: {
          $ref: '#/definitions/order'
        }
      }
    }
  }
  t.true(isObjectArrayControl(control, schemaWithRefs, schemaWithRefs));
});

test('isBooleanControl', t => {
  t.false(isBooleanControl(undefined, undefined, undefined));
  t.false(isBooleanControl(null, undefined, undefined));
  t.false(isBooleanControl({ type: 'Foo' }, undefined, undefined));
  t.false(isBooleanControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isBooleanControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  t.false(
    isBooleanControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'boolean' } }
    }, undefined)
  );
  t.true(
    isBooleanControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'boolean' } }
    }, undefined)
  );
});

test('test isDateControl', t => {
  t.false(isDateControl(undefined, undefined, undefined));
  t.false(isDateControl(null, undefined, undefined));
  t.false(isDateControl({ type: 'Foo' }, undefined, undefined));
  t.false(isDateControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isDateControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  t.false(
    isDateControl(t.context.uischema, {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: {
          type: 'string',
          format: 'date'
        }
      }
    }, undefined)
  );
  t.true(
    isDateControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string', format: 'date' } }
    }, undefined)
  );
});
test('test isEnumControl', t => {
  t.false(isEnumControl(undefined, undefined, undefined));
  t.false(isEnumControl(null, undefined, undefined));
  t.false(isEnumControl({ type: 'Foo' }, undefined, undefined));
  t.false(isEnumControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isEnumControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  t.false(
    isEnumControl(t.context.uischema, {
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
    }, undefined)
  );
  t.true(
    isEnumControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string', enum: ['a', 'b'] } }
    }, undefined)
  );
  t.true(
    isEnumControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'number', enum: [1, 2] } }
    }, undefined)
  );
  t.true(
    isEnumControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { const: '1.0' } }
    }, undefined)
  );
});
test('test isIntegerControl', t => {
  t.false(isIntegerControl(undefined, undefined, undefined));
  t.false(isIntegerControl(null, undefined, undefined));
  t.false(isIntegerControl({ type: 'Foo' }, undefined, undefined));
  t.false(isIntegerControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isIntegerControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  t.false(
    isIntegerControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'integer' } }
    }, undefined)
  );
  t.true(
    isIntegerControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'integer' } }
    }, undefined)
  );
});
test('test isNumberControl', t => {
  t.false(isNumberControl(undefined, undefined, undefined));
  t.false(isNumberControl(null, undefined, undefined));
  t.false(isNumberControl({ type: 'Foo' }, undefined, undefined));
  t.false(isNumberControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isNumberControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  t.false(
    isNumberControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'number' } }
    }, undefined)
  );
  t.true(
    isNumberControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'number' } }
    }, undefined)
  );
});
test('tester isStringControl', t => {
  t.false(isStringControl(undefined, undefined, undefined));
  t.false(isStringControl(null, undefined, undefined));
  t.false(isStringControl({ type: 'Foo' }, undefined, undefined));
  t.false(isStringControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isStringControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'number' } }
    }, undefined)
  );
  t.false(
    isStringControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'number' }, bar: { type: 'string' } }
    }, undefined)
  );
  t.true(
    isStringControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
});
test('test isTimeControl', t => {
  t.false(isTimeControl(undefined, undefined, undefined));
  t.false(isTimeControl(null, undefined, undefined));
  t.false(isTimeControl({ type: 'Foo' }, undefined, undefined));
  t.false(isTimeControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isTimeControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  t.false(
    isTimeControl(t.context.uischema, {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: { type: 'string', format: 'time' }
      }
    }, undefined)
  );
  t.true(
    isTimeControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string', format: 'time' } }
    }, undefined)
  );
});
test('tester isMultiLineControl', t => {
  t.false(isMultiLineControl(undefined, undefined, undefined));
  t.false(isMultiLineControl(null, undefined, undefined));
  t.false(isMultiLineControl({ type: 'Foo' }, undefined, undefined));
  t.false(isMultiLineControl({ type: 'Control' }, undefined, undefined));
  t.false(
    isMultiLineControl(t.context.uischema, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
  const control = t.context.uischema;
  control.options = { multi: true };
  t.true(
    isMultiLineControl(control, {
      type: 'object',
      properties: { foo: { type: 'string' } }
    }, undefined)
  );
});

test('tester isObjectArrayWithNesting', t => {
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

  const nestedSchemaWithRef =
  {
    definitions: { itemsType: { ...schema } },
    type: 'array',
    items: {
      $ref: '#/definitions/itemsType'
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

  t.false(isObjectArrayWithNesting(undefined, undefined, undefined));
  t.false(isObjectArrayWithNesting(null, undefined, undefined));
  t.false(isObjectArrayWithNesting({ type: 'Foo' }, undefined, undefined));
  t.false(isObjectArrayWithNesting({ type: 'Control' }, undefined, undefined));
  t.false(isObjectArrayWithNesting(uischema, schema, undefined));
  t.true(isObjectArrayWithNesting(uischema, nestedSchema, undefined));
  t.true(isObjectArrayWithNesting(uischema, nestedSchema2, undefined));
  t.true(isObjectArrayWithNesting(uischema, nestedSchema3, undefined));
  t.true(isObjectArrayWithNesting(uischema, nestedSchemaWithRef, nestedSchemaWithRef));

  t.false(isObjectArrayWithNesting(uischemaOptions.default, schema, undefined));
  t.true(isObjectArrayWithNesting(uischemaOptions.generate, schema, undefined));
  t.true(isObjectArrayWithNesting(uischemaOptions.inline, schema, undefined));
});

test('tester schemaSubPathMatches', t => {
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
    schemaSubPathMatches('items', items => items.type === 'number')(
      uischema,
      schema,
      undefined
    )
  );
});

test('tester not', t => {
  t.false(
    not(isBooleanControl)(t.context.uischema, {
      type: 'boolean'
    }, undefined)
  );
});

test('tester isOneOfEnumControl', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/country'
  };
  const oneOfSchema = {
    type: 'string',
    oneOf: [
      {
        const: 'AU',
        title: 'Australia'
      },
      {
        const: 'NZ',
        title: 'New Zealand'
      }
    ]
  };

  t.true(isOneOfEnumControl(control, {
    type: 'object',
    properties: {
      country: oneOfSchema
    }
  }, undefined));
  const schemaWithRefs = {
    definitions: { country: oneOfSchema },
    type: 'object',
    properties: {
      country: {
        $ref: '#/definitions/country'
      }
    }
  }
  t.true(isOneOfEnumControl(control, schemaWithRefs, schemaWithRefs));
});

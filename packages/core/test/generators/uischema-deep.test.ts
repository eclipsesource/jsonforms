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
import test from 'ava';
import { generateDeepDefaultUISchema, generateDefaultUISchema } from '../../src/generators/uischema';
import {
  ControlElement,
  LabelElement,
  Layout,
  VerticalLayout
} from '../../src/models/uischema';
import { JsonSchema } from '../../src';

test('generate deep ui schema for Control element by resolving refs', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        const: 'Control',
        default: 'Control'
      },
      label: {
        type: 'string'
      },
      scope: {
        $ref: '#/definitions/scope'
      },
      rule: {
        $ref: '#/definitions/rule'
      }
    },
    required: ['type', 'scope'],
    definitions: {
      scope: {
        type: 'string',
        pattern: '^#\\/properties\\/{1}'
      },
      rule: {
        type: 'object',
        properties: {
          effect: {
            type: 'string',
            enum: ['HIDE', 'SHOW', 'DISABLE', 'ENABLE']
          },
          condition: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                const: 'LEAF'
              },
              scope: {
                $ref: '#/definitions/scope'
              },
              expectedValue: {
                type: ['string', 'integer', 'number', 'boolean']
              }
            },
            required: ['type', 'scope', 'expectedValue']
          }
        },
        required: ['effect', 'condition']
      }
    }
  };
  const typeControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/type'
  };
  const labelControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/label'
  };
  const scopeControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/scope'
  };
  const ruleLabel: LabelElement = {
    text: 'Rule',
    type: 'Label',
  };
  const effectControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/rule/properties/effect'
  };
  const conditionLabel: LabelElement = {
    text: 'Condition',
    type: 'Label',
  };

  const conditiontypeControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/rule/properties/condition/properties/type',
  };
  const conditionscopeControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/rule/properties/condition/properties/scope',
  };
  const conditionexpectedValueControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/rule/properties/condition/properties/expectedValue',

  };
  const conditonLayout: VerticalLayout = {
    elements: [
      conditionLabel,
      conditiontypeControl,
      conditionscopeControl,
      conditionexpectedValueControl,
    ],
    type: 'VerticalLayout',
  };
  const ruleControl: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      ruleLabel,
      effectControl,
      conditonLayout,
    ],
  };

  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [typeControl, labelControl, scopeControl, ruleControl]
  };
  const generatedUiSchema = generateDeepDefaultUISchema(schema);
  t.deepEqual(generatedUiSchema, uischema);
});

test('generate deep ui schema for schema w/o properties', t => {
  const schema: JsonSchema = {
    type: 'object'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: []
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep ui schema for schema with one property', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const control = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep ui schema for schema without object root', t => {
  const schema: JsonSchema = {
    type: 'string'
  };
  const control: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep ui schema for schema with unspecified object root', t => {
  const schema: JsonSchema = {
    properties: {
      age: {
        type: 'integer'
      }
    }
  };
  const controlElement = {
    type: 'Control',
    scope: '#/properties/age'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [controlElement]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test(`deep nested object not expanded`, t => {
  const schema = {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      private: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    }
  };
  const idControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/id'
  };
  const nameControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/private/properties/name'
  };
  const privateControl: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      nameControl
    ]
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [idControl, privateControl]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test(`deep don't ignore non-json-schema id attributes`, t => {
  const schema = {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      }
    }
  };
  const idControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/id'
  };
  const nameControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [idControl, nameControl]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep ui schema for schema with multiple properties', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'objectId'
      },
      lastName: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      firstName: {
        type: 'string'
      },
      gender: {
        type: 'string',
        enum: ['Male', 'Female']
      },
      active: {
        type: 'boolean'
      },
      registrationTime: {
        type: 'string',
        format: 'date-time'
      },
      weight: {
        type: 'number'
      },
      height: {
        type: 'integer'
      },
      nationality: {
        type: 'string',
        enum: ['German', 'French', 'UK', 'US', 'Spanish', 'Italian', 'Russian']
      },
      birthDate: {
        type: 'string',
        format: 'date-time'
      }
    },
    additionalProperties: false,
    required: ['id', 'lastName', 'email']
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/id'
      },
      {
        type: 'Control',
        scope: '#/properties/lastName'
      },
      {
        type: 'Control',
        scope: '#/properties/email'
      },
      {
        type: 'Control',
        scope: '#/properties/firstName'
      },
      {
        type: 'Control',
        scope: '#/properties/gender'
      },
      {
        type: 'Control',
        scope: '#/properties/active'
      },
      {
        type: 'Control',
        scope: '#/properties/registrationTime'
      },
      {
        type: 'Control',
        scope: '#/properties/weight'
      },
      {
        type: 'Control',
        scope: '#/properties/height'
      },
      {
        type: 'Control',
        scope: '#/properties/nationality'
      },
      {
        type: 'Control',
        scope: '#/properties/birthDate'
      }
    ] as ControlElement[]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep named array control', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      comments: {
        type: 'array',
        items: {
          properties: {
            msg: {type: 'string'}
          }
        }
      }
    }
  };
  const msgGontrol: ControlElement = {
    type: 'Control',
    scope: '#/properties/msg'
  };
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/comments',
    options: {
      detail: {
        type: 'VerticalLayout',
        elements: [msgGontrol]
      }
    },
  };
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep unnamed array control', t => {
  const schema: JsonSchema = {
    type: 'array',
    items: {
      properties: {
        msg: {type: 'string'}
      }
    }
  };
  const control: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate deep unnamed array control w/o type', t => {
  const schema: JsonSchema = {
    items: {
      properties: {
        msg: {type: 'string'}
      }
    }
  };

  const msgGontrol: ControlElement = {
    type: 'Control',
    scope: '#/properties/msg'
  };
  const control: ControlElement = {
    type: 'Control',
    scope: '#',
    options: {
      detail: {
        type: 'VerticalLayout',
        elements: [msgGontrol]
      }
    },
  };
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep for empty schema', t => {
  const schema: JsonSchema = {};
  const uischema: Layout = null;
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep for null schema', t => {
  const schema: JsonSchema = null;
  const uischema: Layout = null;
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep for undefined schema', t => {
  const schema: JsonSchema = undefined;
  const uischema: Layout = null;
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep control for oneOf', t => {
  const schema: JsonSchema = {
    oneOf: [
      {
        properties: {
          name: {
            type: 'string'
          }
        }
      },
      {
        type: 'number'
      }
    ]
  };
  const control = {
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep control for anyOf', t => {
  const schema: JsonSchema = {
    anyOf: [
      {
        properties: {
          name: {
            type: 'string'
          }
        }
      },
      {
        type: 'number'
      }
    ]
  };
  const control = {
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep control for allOf', t => {
  const schema: JsonSchema = {
    allOf: [
      {
        properties: {
          name: {
            type: 'string'
          }
        }
      },
      {
        type: 'number'
      }
    ]
  };
  const control = {
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep no separate control for oneOf in array', t => {
  const schema: JsonSchema = {
    properties: {
      myarray: {
        items: {
          oneOf: [
            {
              properties: {
                name: {
                  type: 'string'
                }
              }
            },
            {
              type: 'number'
            }
          ]
        }
      }
    }
  };
  const control = {
    type: 'Control',
    scope: '#/properties/myarray',
    options: {
      detail: {
        scope: '#',
        type: 'Control',
      },
    },
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep array with items array', t => {
  const schema: JsonSchema = {
    properties: {
      myarray: {
        type: 'array',
        items: [
          {
            type: 'number'
          },
          {
            type: 'string'
          },
          {
            type: 'string',
            enum: ['Street', 'Avenue', 'Boulevard']
          },
          {
            type: 'string',
            enum: ['NW', 'NE', 'SW', 'SE']
          }
        ]
      }
    }
  };

  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/myarray',
  };
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [control]
  };

  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

test('generate deep control for nested oneOf', t => {
  const schema: JsonSchema = {
    properties: {
      myarray: {
        properties: {
          nameOrAge: {
            oneOf: [
              {
                properties: {
                  name: {
                    type: 'string'
                  }
                }
              },
              {
                type: 'number'
              }
            ]
          }
        }
      }
    }
  };

  const nameOrAgeControl = {
    scope: '#/properties/myarray/properties/nameOrAge',
    type: 'Control',
  };

  const myArrayControl: VerticalLayout = {
    // scope: '#/properties/myarray',
    type: 'VerticalLayout',
    elements: [
      nameOrAgeControl
    ],
};

  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [myArrayControl]
  };
  t.deepEqual(generateDeepDefaultUISchema(schema), uischema);
});

/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import { generateDefaultUISchema } from '../../src/generators/uischema';
import {
  ControlElement,
  LabelElement,
  Layout,
  VerticalLayout
} from '../../src/models/uischema';
import { JsonSchema } from '../../src';

test('generate ui schema for Control element by resolving refs', t => {
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
  const ruleLabel: LabelElement = {
    type: 'Label',
    text: 'Rule'
  };
  const conditionLabel: LabelElement = {
    type: 'Label',
    text: 'Condition'
  };
  const typeControl: ControlElement = {
    type: 'Control',
    label: 'Type',
    scope: '#/properties/type'
  };
  const labelControl: ControlElement = {
    type: 'Control',
    label: 'Label',
    scope: '#/properties/label'
  };
  const scopeControl: ControlElement = {
    type: 'Control',
    label: 'Scope',
    scope: '#/properties/scope'
  };
  const effectControl: ControlElement = {
    type: 'Control',
    label: 'Effect',
    scope: '#/properties/rule/properties/effect'
  };

  const conditionTypeControl: ControlElement = {
    type: 'Control',
    label: 'Type',
    scope: '#/properties/rule/properties/condition/properties/type'
  };
  const conditionScopeControl: ControlElement = {
    type: 'Control',
    label: 'Scope',
    scope: '#/properties/rule/properties/condition/properties/scope'
  };
  const conditionExpectedValueControl: ControlElement = {
    type: 'Control',
    label: 'Expected Value',
    scope: '#/properties/rule/properties/condition/properties/expectedValue'
  };
  const conditionLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      conditionLabel,
      conditionTypeControl,
      conditionScopeControl,
      conditionExpectedValueControl
    ]
  };
  const ruleLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [ruleLabel, effectControl, conditionLayout]
  };
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [typeControl, labelControl, scopeControl, ruleLayout]
  };
  const generatedUiSchema = generateDefaultUISchema(schema);
  t.deepEqual(generatedUiSchema, uischema);
});

test('generate ui schema for schema w/o properties', t => {
  const schema: JsonSchema = {
    type: 'object'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: []
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate ui schema for schema with one property', t => {
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
    label: 'Name',
    scope: '#/properties/name'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate ui schema for schema without object root', t => {
  const schema: JsonSchema = {
    type: 'string'
  };
  const control: ControlElement = {
    label: '',
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate ui schema for schema with unspecified object root', t => {
  const schema: JsonSchema = {
    properties: {
      age: {
        type: 'integer'
      }
    }
  };
  const controlElement = {
    type: 'Control',
    label: 'Age',
    scope: '#/properties/age'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [controlElement]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test(`nested object attributes`, t => {
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
    label: 'Id',
    scope: '#/properties/id'
  };
  const nameControl: ControlElement = {
    type: 'Control',
    label: 'Name',
    scope: '#/properties/private/properties/name'
  };
  const nestedLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [nameControl]
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [idControl, nestedLayout]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test(`don't ignore non-json-schema id attributes`, t => {
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
    label: 'Id',
    scope: '#/properties/id'
  };
  const nameControl: ControlElement = {
    type: 'Control',
    label: 'Name',
    scope: '#/properties/name'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [idControl, nameControl]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate ui schema for schema with multiple properties', t => {
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
        label: 'Id',
        scope: '#/properties/id'
      },
      {
        type: 'Control',
        label: 'Last Name',
        scope: '#/properties/lastName'
      },
      {
        type: 'Control',
        label: 'Email',
        scope: '#/properties/email'
      },
      {
        type: 'Control',
        label: 'First Name',
        scope: '#/properties/firstName'
      },
      {
        type: 'Control',
        label: 'Gender',
        scope: '#/properties/gender'
      },
      {
        type: 'Control',
        label: 'Active',
        scope: '#/properties/active'
      },
      {
        type: 'Control',
        label: 'Registration Time',
        scope: '#/properties/registrationTime'
      },
      {
        type: 'Control',
        label: 'Weight',
        scope: '#/properties/weight'
      },
      {
        type: 'Control',
        label: 'Height',
        scope: '#/properties/height'
      },
      {
        type: 'Control',
        label: 'Nationality',
        scope: '#/properties/nationality'
      },
      {
        type: 'Control',
        label: 'Birth Date',
        scope: '#/properties/birthDate'
      }
    ] as ControlElement[]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate named array control', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      comments: {
        type: 'array',
        items: {
          properties: {
            msg: { type: 'string' }
          }
        }
      }
    }
  };
  const control: ControlElement = {
    label: 'Comments',
    type: 'Control',
    scope: '#/properties/comments'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate unnamed array control', t => {
  const schema: JsonSchema = {
    type: 'array',
    items: {
      properties: {
        msg: { type: 'string' }
      }
    }
  };
  const control: ControlElement = {
    label: '',
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate unnamed array control w/o type', t => {
  const schema: JsonSchema = {
    items: {
      properties: {
        msg: { type: 'string' }
      }
    }
  };
  const control = {
    label: '',
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate for empty schema', t => {
  const schema: JsonSchema = {};
  const uischema: Layout = null;
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate for null schema', t => {
  const schema: JsonSchema = null;
  const uischema: Layout = null;
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate for undefined schema', t => {
  const schema: JsonSchema = undefined;
  const uischema: Layout = null;
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate control for oneOf', t => {
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
    label: '',
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate control for anyOf', t => {
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
    label: '',
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate control for allOf', t => {
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
    label: '',
    type: 'Control',
    scope: '#'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('no separate control for oneOf in array', t => {
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
    label: 'Myarray',
    type: 'Control',
    scope: '#/properties/myarray'
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

test('generate control for nested oneOf', t => {
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
  const control = {
    label: 'Name Or Age',
    type: 'Control',
    scope: '#/properties/myarray/properties/nameOrAge'
  };
  const nestedUiSchema: Layout = {
    type: 'VerticalLayout',
    elements: [control]
  };
  const uischema: Layout = {
    type: 'VerticalLayout',
    elements: [nestedUiSchema]
  };
  t.deepEqual(generateDefaultUISchema(schema), uischema);
});

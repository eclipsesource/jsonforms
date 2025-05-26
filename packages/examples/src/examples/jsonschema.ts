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
import {
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  NOT_APPLICABLE,
  type UISchemaElement,
} from '@jsonforms/core';
import { registerExamples } from '../register';
import { StateProps } from '../example';

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://json-schema.org/draft-07/schema#',
  title: 'Core schema meta-schema',
  definitions: {
    schemaArray: {
      type: 'array',
      minItems: 1,
      items: { $ref: '#' },
    },
    nonNegativeInteger: {
      type: 'integer',
      minimum: 0,
    },
    nonNegativeIntegerDefault0: {
      allOf: [{ $ref: '#/definitions/nonNegativeInteger' }, { default: 0 }],
    },
    simpleTypes: {
      type: 'string',
      enum: [
        'array',
        'boolean',
        'integer',
        'null',
        'number',
        'object',
        'string',
      ],
    },
    stringArray: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      default: [] as any,
    },
  },
  type: ['object', 'boolean'],
  properties: {
    $id: {
      type: 'string',
      format: 'uri-reference',
    },
    $schema: {
      type: 'string',
      format: 'uri',
    },
    $ref: {
      type: 'string',
      format: 'uri-reference',
    },
    $comment: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    default: true,
    readOnly: {
      type: 'boolean',
      default: false,
    },
    writeOnly: {
      type: 'boolean',
      default: false,
    },
    examples: {
      type: 'array',
      items: true,
    },
    multipleOf: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    maximum: {
      type: 'number',
    },
    exclusiveMaximum: {
      type: 'number',
    },
    minimum: {
      type: 'number',
    },
    exclusiveMinimum: {
      type: 'number',
    },
    maxLength: { $ref: '#/definitions/nonNegativeInteger' },
    minLength: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
    pattern: {
      type: 'string',
      format: 'regex',
    },
    additionalItems: { $ref: '#' },
    items: {
      anyOf: [{ $ref: '#' }, { $ref: '#/definitions/schemaArray' }],
      default: true,
    },
    maxItems: { $ref: '#/definitions/nonNegativeInteger' },
    minItems: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
    uniqueItems: {
      type: 'boolean',
      default: false,
    },
    contains: { $ref: '#' },
    maxProperties: { $ref: '#/definitions/nonNegativeInteger' },
    minProperties: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
    required: { $ref: '#/definitions/stringArray' },
    additionalProperties: { $ref: '#' },
    definitions: {
      type: 'object',
      additionalProperties: { $ref: '#' },
      default: {},
    },
    properties: {
      type: 'object',
      additionalProperties: { $ref: '#' },
      default: {},
    },
    patternProperties: {
      type: 'object',
      additionalProperties: { $ref: '#' },
      propertyNames: { format: 'regex' },
      default: {},
    },
    dependencies: {
      type: 'object',
      additionalProperties: {
        anyOf: [{ $ref: '#' }, { $ref: '#/definitions/stringArray' }],
      },
    },
    propertyNames: { $ref: '#' },
    const: true,
    enum: {
      type: 'array',
      items: true,
      minItems: 1,
      uniqueItems: true,
    },
    type: {
      anyOf: [
        { $ref: '#/definitions/simpleTypes' },
        {
          type: 'array',
          items: { $ref: '#/definitions/simpleTypes' },
          minItems: 1,
          uniqueItems: true,
        },
      ],
    },
    format: { type: 'string' },
    contentMediaType: { type: 'string' },
    contentEncoding: { type: 'string' },
    if: { $ref: '#' },
    then: { $ref: '#' },
    else: { $ref: '#' },
    allOf: { $ref: '#/definitions/schemaArray' },
    anyOf: { $ref: '#/definitions/schemaArray' },
    oneOf: { $ref: '#/definitions/schemaArray' },
    not: { $ref: '#' },
  },
  default: true,
};

export const uischema: UISchemaElement = undefined as any as UISchemaElement;

export const data = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your name',
    },
    vegetarian: {
      type: 'boolean',
    },
    birthDate: {
      type: 'string',
      format: 'date',
    },
    nationality: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
    personalData: {
      type: 'object',
      properties: {
        age: {
          type: 'integer',
          description: 'Please enter your age.',
        },
        height: {
          type: 'number',
        },
        drivingSkill: {
          type: 'number',
          maximum: 10,
          minimum: 1,
          default: 7,
        },
      },
      required: ['age', 'height'],
    },
    occupation: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
      maxLength: 5,
    },
  },
  required: ['occupation', 'nationality'],
};

const shouldContainTypeCondition = (type: string[]) => {
  return {
    scope: '#/properties/type',
    schema: {
      anyOf: [
        {
          type: 'string',
          enum: type,
        },
        {
          type: 'array',
          items: {
            type: 'string',
          },
          contains: {
            type: 'string',
            enum: type,
          },
        },
      ],
    },
  };
};

const typeIsSpecifiedCondition = {
  scope: '#/properties/type',
  schema: {
    oneOf: [
      {
        type: 'string',
        enum: [
          'string',
          'number',
          'integer',
          'array',
          'object',
          'boolean',
          'null',
        ],
      },
      {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'string',
            'number',
            'integer',
            'array',
            'object',
            'boolean',
            'null',
          ],
        },
        minItems: 1,
        uniqueItems: true,
      },
    ],
  },
};

const properties = {
  type: 'Control',
  scope: '#/properties/properties',
};

const required = {
  type: 'Control',
  scope: '#/properties/required',
};

const constraintsLayout = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Number',
      rule: {
        effect: 'SHOW',
        condition: shouldContainTypeCondition(['number', 'integer']),
      },
      elements: [
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/multipleOf',
            },
            {
              type: 'Control',
              scope: '#/properties/maximum',
            },
            {
              type: 'Control',
              scope: '#/properties/exclusiveMaximum',
            },
            {
              type: 'Control',
              scope: '#/properties/minimum',
            },
            {
              type: 'Control',
              scope: '#/properties/exclusiveMinimum',
            },
          ],
        },
      ],
    },
    {
      type: 'Category',
      label: 'String',
      rule: {
        effect: 'SHOW',
        condition: shouldContainTypeCondition(['string']),
      },
      elements: [
        {
          type: 'Control',
          scope: '#/properties/maxLength',
        },
        {
          type: 'Control',
          scope: '#/properties/minLength',
        },
        {
          type: 'Control',
          scope: '#/properties/pattern',
        },
      ],
    },
    {
      type: 'Category',
      label: 'Array',
      rule: {
        effect: 'SHOW',
        condition: shouldContainTypeCondition(['array']),
      },
      elements: [
        {
          type: 'Control',
          scope: '#/properties/minItems',
        },
        {
          type: 'Control',
          scope: '#/properties/maxItems',
        },
        {
          type: 'Control',
          scope: '#/properties/uniqueItems',
        },
      ],
    },
    {
      type: 'Category',
      label: 'Object',
      rule: {
        effect: 'SHOW',
        condition: shouldContainTypeCondition(['object']),
      },
      elements: [
        {
          type: 'Control',
          scope: '#/properties/minProperties',
        },
        {
          type: 'Control',
          scope: '#/properties/maxProperties',
        },
      ],
    },
  ],
};

const controlLabel = (
  controlSchemaPath: string,
  controlLabel: string,
  controlSchemaType: string | undefined = undefined
) => {
  return {
    tester: (jsonSchema: JsonSchema, schemaPath: string, _path: string) => {
      if (
        controlSchemaPath === schemaPath &&
        (controlSchemaType === undefined ||
          controlSchemaType === jsonSchema.type)
      ) {
        return 2;
      }
      return NOT_APPLICABLE;
    },
    uischema: {
      type: 'Control',
      scope: '#',
      label: controlLabel,
    },
  };
};

export const uischemas = [
  controlLabel('#/properties/minItems', 'Min Items', 'number'),
  controlLabel('#/properties/maxItems', 'Max Items'),
  {
    tester: (jsonSchema: JsonSchema, schemaPath: string, path: string) => {
      if (
        path === 'type' &&
        schemaPath === '#/properties/type' &&
        jsonSchema.type === 'array'
      ) {
        return 2;
      }
      return NOT_APPLICABLE;
    },
    uischema: {
      type: 'Control',
      scope: '#',
    },
  },
  {
    tester: (jsonSchema: JsonSchema, _schemaPath: string, _path: string) => {
      return 'http://json-schema.org/draft-07/schema#' ===
        (jsonSchema as any).$id && jsonSchema.type === 'object'
        ? 2
        : NOT_APPLICABLE;
    },
    uischema: {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'Basic',
          elements: [
            {
              type: 'VerticalLayout',
              elements: [
                { type: 'Control', scope: '#/properties/$id' },
                { type: 'Control', scope: '#/properties/$schema' },
                { type: 'Control', scope: '#/properties/title' },
                { type: 'Control', scope: '#/properties/description' },
              ],
            },
          ],
        },
        {
          type: 'Category',
          label: 'Structure',
          elements: [
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/type',
                  options: {
                    'label-0': 'Single Type',
                    'label-1': 'Multiple Types',
                  },
                },
                {
                  type: 'Categorization',
                  rule: {
                    effect: 'SHOW',
                    condition: shouldContainTypeCondition(['object']),
                  },
                  elements: [
                    {
                      type: 'Category',
                      label: 'Properties',
                      elements: [properties],
                    },
                    {
                      type: 'Category',
                      label: 'Required',
                      elements: [required],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'Category',
          label: 'Constraints',
          rule: {
            effect: 'SHOW',
            condition: typeIsSpecifiedCondition,
          },
          elements: [constraintsLayout],
        },
      ],
      options: {
        variant: 'stepper',
        showNavButtons: true,
      },
    },
  },
  {
    tester: (jsonSchema: JsonSchema, _schemaPath: string, _path: string) => {
      return 'http://json-schema.org/draft-07/schema#' ===
        (jsonSchema as any).$id && jsonSchema.type === 'boolean'
        ? 2
        : NOT_APPLICABLE;
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [{ type: 'Control', scope: '#/' }],
    },
  },
];

const actions = [
  {
    label: 'Register UISchema',
    apply: (props: StateProps) => {
      return {
        ...props,
        uischemas: uischemas,
      };
    },
  },
  {
    label: 'Unregister UISchema',
    apply: (props: StateProps) => {
      const uischemas: JsonFormsUISchemaRegistryEntry[] =
        undefined as any as JsonFormsUISchemaRegistryEntry[];
      return {
        ...props,
        uischemas: uischemas,
      };
    },
  },
];

registerExamples([
  {
    name: 'jsonschema',
    label: 'JsonSchema',
    data,
    schema: schema as any as JsonSchema,
    uischema,
    actions,
  },
]);

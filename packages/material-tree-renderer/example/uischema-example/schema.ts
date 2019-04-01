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
export const UIMetaSchema = {
  type: 'object',
  $id: '#root',
  properties: {
    type: {
      type: 'string',
      enum: ['HorizontalLayout', 'VerticalLayout', 'Group', 'Categorization']
    },
    label: {
      type: 'string'
    },
    elements: {
      $ref: '#/definitions/elements'
    },
    rule: {
      $ref: '#/definitions/rule'
    }
  },
  definitions: {
    elements: {
      type: 'array',
      $id: '#elements',
      items: {
        anyOf: [
          {
            $ref: '#/definitions/control'
          },
          {
            $ref: '#/definitions/horizontallayout'
          },
          {
            $ref: '#/definitions/verticallayout'
          },
          {
            $ref: '#/definitions/categorization'
          },
          {
            $ref: '#/definitions/category'
          },
          {
            $ref: '#/definitions/group'
          }
        ]
      }
    },
    control: {
      type: 'object',
      $id: '#control',
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
        options: {
          $ref: '#/definitions/options'
        },
        rule: {
          $ref: '#/definitions/rule'
        }
      },
      required: ['type', 'scope']
    },
    horizontallayout: {
      type: 'object',
      $id: '#horizontallayout',
      properties: {
        type: {
          type: 'string',
          const: 'HorizontalLayout',
          default: 'HorizontalLayout'
        },
        elements: {
          $ref: '#/definitions/elements'
        },
        rule: {
          $ref: '#/definitions/rule'
        }
      },
      required: ['type', 'elements']
    },
    verticallayout: {
      type: 'object',
      $id: '#verticallayout',
      properties: {
        type: {
          type: 'string',
          const: 'VerticalLayout',
          default: 'VerticalLayout'
        },
        elements: {
          $ref: '#/definitions/elements'
        },
        rule: {
          $ref: '#/definitions/rule'
        }
      },
      required: ['type', 'elements']
    },
    categorization: {
      type: 'object',
      $id: '#categorization',
      properties: {
        type: {
          type: 'string',
          const: 'Categorization',
          default: 'Categorization'
        },
        elements: {
          type: 'array',
          items: {
            $ref: '#/definitions/category'
          }
        }
      },
      required: ['type', 'elements']
    },
    category: {
      type: 'object',
      $id: '#category',
      properties: {
        label: {
          type: 'string'
        },
        elements: {
          $ref: '#/definitions/elements'
        },
        type: {
          type: 'string',
          const: 'Category',
          default: 'Category'
        },
        rule: {
          $ref: '#/definitions/rule'
        }
      },
      required: ['type', 'elements']
    },
    group: {
      type: 'object',
      $id: '#group',
      properties: {
        type: {
          type: 'string',
          const: 'Group',
          default: 'Group'
        },
        elements: {
          $ref: '#/definitions/elements'
        },
        label: {
          type: 'string'
        }
      },
      required: ['type', 'elements', 'label']
    },
    rule: {
      type: 'object',
      $id: '#rule',
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
    },
    scope: {
      type: 'string',
      $id: '#scope',
      pattern: '^#\\/properties\\/{1}'
    },
    options: {
      type: 'object',
      $id: '#options',
      additionalProperties: true
    }
  },
  additionalProperties: false,
  required: ['elements', 'type']
};

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

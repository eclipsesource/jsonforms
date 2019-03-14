import { registerExamples } from './register';

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',

  definitions: {
    address: {
      type: 'object',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' }
      },
      required: ['street_address', 'city', 'state']
    },
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        mail: { type: 'string' }
      },
      required: ['name', 'mail']
    }
  },

  type: 'object',

  properties: {
    name: { type: 'string' },
    addressOrUser: {
      oneOf: [{ $ref: '#/definitions/address' }, { $ref: '#/definitions/user' }]
    }
  }
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      scope: '#/properties/addressOrUser'
    }
  ]
};

const data = {
  name: 'test',
  addressOrUser: {
    street_address: '1600 Pennsylvania Avenue NW',
    city: 'Washington',
    state: 'DC'
  }
};

const schema_1265_array = {
  type: 'object',
  properties: {
    coloursOrNumbers: {
      oneOf: [
        {
          $ref: '#/definitions/colours'
        },
        {
          $ref: '#/definitions/numbers'
        },
        {
          $ref: '#/definitions/shapes'
        }
      ]
    }
  },
  definitions: {
    colours: {
      title: 'Colours',
      type: 'array',
      items: {
        title: 'Type',
        type: 'string',
        enum: ['Red', 'Green', 'Blue'],
        minItems: 1
      }
    },
    numbers: {
      title: 'Numbers',
      type: 'array',
      items: {
        title: 'Type',
        type: 'string',
        enum: ['One', 'Two', 'Three'],
        minItems: 1
      }
    },
    shapes: {
      title: 'Shapes',
      type: 'array',
      items: {
        title: 'Type',
        type: 'string',
        enum: ['Circle', 'Triangle', 'Square'],
        minItems: 1
      }
    }
  }
};

const schema_1265_object = {
  type: 'object',
  properties: {
    coloursOrNumbers: {
      oneOf: [
        {
          $ref: '#/definitions/colours'
        },
        {
          $ref: '#/definitions/numbers'
        },
        {
          $ref: '#/definitions/shapes'
        }
      ]
    }
  },
  additionalProperties: false,
  definitions: {
    colours: {
      title: 'Colours',
      type: 'object',
      properties: {
        colour: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue']
        }
      },
      additionalProperties: false
    },
    numbers: {
      title: 'Numbers',
      type: 'object',
      properties: {
        number: {
          title: 'Type',
          type: 'string',
          enum: ['One', 'Two', 'Three']
        }
      },
      additionalProperties: false
    },
    shapes: {
      title: 'Shapes',
      type: 'object',
      properties: {
        shape: {
          title: 'Type',
          type: 'string',
          enum: ['Circle', 'Triangle', 'Square']
        }
      },
      additionalProperties: false
    }
  }
};

const schema_1265_simple = {
  type: 'object',
  properties: {
    coloursOrNumbers: {
      oneOf: [
        {
          $ref: '#/definitions/colours'
        },
        {
          $ref: '#/definitions/numbers'
        },
        {
          $ref: '#/definitions/shapes'
        }
      ]
    }
  },
  definitions: {
    colours: {
      title: 'Colours',
      type: 'string',
      enum: ['Red', 'Green', 'Blue']
    },
    numbers: {
      title: 'Numbers',
      type: 'string',
      enum: ['One', 'Two', 'Three']
    },
    shapes: {
      title: 'Shapes',
      type: 'string',
      enum: ['Circle', 'Triangle', 'Square']
    }
  }
};

registerExamples([
  {
    name: 'oneOf',
    label: 'oneOf',
    data,
    schema,
    uischema
  },
  {
    name: '1265_array',
    label: '1265 Array',
    data: { coloursOrNumbers: ['Foo'] },
    schema: schema_1265_array,
    uischema: undefined
  },
  {
    name: '1265_object',
    label: '1265 Object',
    data: { coloursOrNumbers: { colour: 'Foo' } },
    schema: schema_1265_object,
    uischema: undefined
  },
  {
    name: '1265_simple',
    label: '1265 Simple',
    data: { coloursOrNumbers: 'Foo' },
    schema: schema_1265_simple,
    uischema: undefined
  }
]);

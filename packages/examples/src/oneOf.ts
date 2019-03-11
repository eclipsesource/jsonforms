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

const schema2 = {
  'type': 'object',
  'properties': {
     'coloursOrNumbers': {
        'oneOf': [
          //  {
          //     '$ref': '#/definitions/colours'
          //  },
          //  {
          //     '$ref': '#/definitions/numbers'
          //  },
          //  {
          //     '$ref': '#/definitions/shapes'
          //  }
          {
            '$ref': '#/definitions/foo'
         },
         {
            '$ref': '#/definitions/bar'
         },
         {
            '$ref': '#/definitions/fooBar'
         }
        ]
     }
  },
  'definitions': {
    'foo': {
        properties: {
          fooInner: {
            'title': 'Colours',
         'type': 'string',
         'enum': [
            'Red',
            'Green',
            'Blue'
         ],
      }
    }, required: ['fooInner']
   },
   'bar': {
    properties: {
      barInner: {
    'title': 'Numbers',
    'type': 'string',
    'enum': [
      'One',
      'Two',
      'Three'
   ],
  }}, required: ['barInner']
},
'fooBar': {
  properties: {
    foobarInner: {
  'title': 'Shapes',
  'type': 'string',
  'enum': [
    'Circle',
    'Triangle',
    'Square'
 ], }}, required: ['foobarInner']
},
     'colours': {
        'title': 'Colours',
        'type': 'array',
        'items': {
           'title': 'Type',
           'type': 'string',
           'enum': [
              'Red',
              'Green',
              'Blue'
           ],
           'minItems': 1
        }
     },
     'numbers': {
        'title': 'Numbers',
        'type': 'array',
        'items': {
           'title': 'Type',
           'type': 'string',
           'enum': [
              'One',
              'Two',
              'Three'
           ],
           'minItems': 1
        }
     },
     'shapes': {
        'title': 'Shapes',
        'type': 'array',
        'items': {
           'title': 'Type',
           'type': 'string',
           'enum': [
              'Circle',
              'Triangle',
              'Square'
           ],
           'minItems': 1
        }
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
    name: '1265',
    label: '1265',
    data: {coloursOrNumbers: {}},
    schema: schema2,
    uischema: undefined
  }
]);

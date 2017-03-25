import {registerExamples} from '../example';
const schema = {
  'definitions': {
    'address': {
      'type': 'object',
      'properties': {
        'street_address': { 'type': 'string' },
        'city':           { 'type': 'string' },
        'state':          { 'type': 'string' },
        'coord':          { '$ref': '#/definitions/coord' },
      },
      'required': ['street_address', 'city', 'state']
    },
    'coord': {'$ref': 'http://json-schema.org/geo'}
  },

  'type': 'object',
  'properties': {
      'address': { '$ref': '#/definitions/address' }
  }
};
const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/address/properties/street_address'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/address/properties/city'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/address/properties/state'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/address/properties/coord/properties/latitude'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/address/properties/coord/properties/longitude'
      }
    }
  ]
};
const data = {
  'address': {
    'street_address': 'Agnes-Pockels Bogen 1',
    'city': 'Munich',
    'state': 'Bavaria'
  }
};
registerExamples([
  {name: 'resolve', label: 'Resolve Remote Schema', data: data, schema: schema, uiSchema: uischema}
]);

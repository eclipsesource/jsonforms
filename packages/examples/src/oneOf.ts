import { registerExamples } from './register';

export const schema = {
    '$schema': 'http://json-schema.org/draft-07/schema#',

    'definitions': {
        'address': {
            'type': 'object',
            'properties': {
                'street_address': { 'type': 'string' },
                'city':           { 'type': 'string' },
                'state':          { 'type': 'string' }
            },
            'required': ['street_address', 'city', 'state']
        },
        'user': {
            'type': 'object',
            'properties': {
                'name': { 'type': 'string' },
                'mail': { 'type': 'string' },
            },
            'required': ['name', 'mail']
        }
    },

    'type': 'object',

    'properties': {
        'name': { 'type': 'string' },
        'addressOrUser': {
            'oneOf': [
                { '$ref': '#/definitions/address' },
                { '$ref': '#/definitions/user' },
            ]
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
    'name': 'test',
    'addressOrUser': {
        'street_address': '1600 Pennsylvania Avenue NW',
        'city': 'Washington',
        'state': 'DC',
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
]);

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
        }
    },

    'type': 'object',

    'properties': {
        'billing_address': { '$ref': '#/definitions/address' },
        'shipping_address': {
            'allOf': [
                { '$ref': '#/definitions/address' },
                {
                    'type': 'object',
                    'properties':
                        {
                            'type': {
                                'type': 'string',
                                'enum': [ 'residential', 'business' ]
                            }
                        },
                    'required': ['type']
                }
            ]
        }
    }
};

export const uischema = {
    type: 'VerticalLayout',
    elements: [
        {
            label: 'Billing address',
            type: 'Control',
            scope: '#/properties/billing_address'
        },
        {
            type: 'Control',
            scope: '#/properties/shipping_address'
        }
    ]
};

const data = {
    'billing_address': {
        'street_address': '1600 Pennsylvania Avenue NW',
        'city': 'Washington',
        'state': 'DC',
    }
};

registerExamples([
    {
        name: 'allOf',
        label: 'allOf',
        data,
        schema,
        uischema
    },
]);

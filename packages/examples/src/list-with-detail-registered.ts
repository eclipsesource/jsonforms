import { registerExamples } from './register';

const data = {
    warehouseitems: [
        {
            name: 'Fantasy Book',
            buyer: {
                email: 'buyerA@info.org',
                age: 18
            },
            status: 'warehouse'
        },
        {
            name: 'Boardgame',
            buyer: {
                email: 'buyerB@info.org',
                age: 45
            },
            status: 'shipping'
        },
        {
            name: 'Energy Drink',
            buyer: {
                email: 'buyerC@info.org',
                age: 90
            },
            status: 'delivered'
        }
    ]
};

const schema = {
    definitions: {
        warehouseitem: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                buyer: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        age: { type: 'number' }
                    }
                },
                status: {
                    type: 'string',
                    enum: ['warehouse', 'shipping', 'delivered']
                }
            },
            required: ['name']
        }
    },
    type: 'object',
    properties: {
        warehouseitems: {
            type: 'array',
            items: {
                $ref: '#/definitions/warehouseitem'
            }
        }
    }
};

const uischema = {
    type: 'ListWithDetail',
    scope: '#/properties/warehouseitems',
    options: {
        labelRef: '#/items/properties/name'
        // detail uischema is registered in example itself
    }
};

registerExamples([
    {
        name: 'list-with-detail-registered',
        label: 'List With Detail (Registered)',
        data,
        schema,
        uischema
    }
]);
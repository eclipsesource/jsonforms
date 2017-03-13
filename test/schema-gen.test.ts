import test from 'ava';

import { JsonSchema } from '../src/models/jsonSchema';
import { generateJsonSchema, generateJsonSchemaWithOptions } from '../src/generators/schema-gen';

test('default schema generation ', t => {
    const instance = {
        'address': {
            'streetAddress': '21 2nd Street',
            'city': 'New York'
        },
        'phoneNumber': [
            {
                'location': 'home',
                'code': 44
            }
        ]
    };
    const schema = generateJsonSchema(instance);
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'address': {
                'type': 'object',
                'properties': {
                    'streetAddress': {
                        'type': 'string'
                    },
                    'city': {
                        'type': 'string'
                    }
                },
                'additionalProperties': true,
                'required': [
                    'streetAddress',
                    'city'
                ]
            },
            'phoneNumber': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'location': {
                            'type': 'string'
                        },
                        'code': {
                            'type': 'integer'
                        }
                    },
                    'additionalProperties': true,
                    'required': [
                        'location',
                        'code'
                    ]
                }
            }
        },
        'additionalProperties': true,
        'required': [
            'address',
            'phoneNumber'
        ]
    } as JsonSchema);
});


test('schema generation with options ', t => {
    const instance = {
        'address': {
            'streetAddress': '21 2nd Street',
            'city': 'New York'
        }
    };
    const schema = generateJsonSchemaWithOptions({
        'additionalProperties': false,
        'required': (props: string[]) => {
            const keys = Object.keys(props);
            if (props !== undefined && keys.length) {
                return [keys[0]];
            } else {
                return [];
            }
        }
    })(instance);

    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'address': {
                'type': 'object',
                'properties': {
                    'streetAddress': {
                        'type': 'string'
                    },
                    'city': {
                        'type': 'string'
                    }
                },
                'additionalProperties': false,
                'required': ['streetAddress']
            }
        },
        'additionalProperties': false,
        'required': ['address']
    } as JsonSchema);
});

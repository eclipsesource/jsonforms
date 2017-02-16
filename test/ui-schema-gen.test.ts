import test from 'ava';
import generateDefaultUISchema, { startCase } from '../src/generators/ui-schema-gen';
import { JsonSchema } from '../src/models/jsonSchema';
import { Layout, ControlElement } from '../src/models/uischema';

test('startCase', t => {
    t.is(startCase("name"), "Name");
    t.is(startCase("fooBar"), "Foo Bar");
});

test('generate ui schema for schema w/o properties', t => {
    const schema: JsonSchema = {
        type: 'object'
    };
    const uiSchema: Layout = {
        type: 'VerticalLayout',
        elements: []
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('generate ui schema for schema with one property', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema: Layout = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Name',
                scope: {
                    $ref: '#/properties/name'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('generate ui schema for schema without object root', t => {
    const schema: JsonSchema = {
        type: 'string'
    };
    const uiSchema: Layout = {
        type: 'VerticalLayout',
        elements: [
            {
                label: '',
                type: 'Control',
                scope: {
                    $ref: '#'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('generate ui schema for schema with unspecified object root', t => {
    const schema: JsonSchema = {
        properties: {
            age: {
                type: 'integer'
            }
        }
    };
    const uiSchema: Layout = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Age',
                scope: {
                    $ref: '#/properties/age'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('ignore json-schema id attributes', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            id: 'ignore me',
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema: Layout = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Name',
                scope: {
                    $ref: '#/properties/name'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test(`don't ignore non-json-schema id attributes`, t => {
    const schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema: Layout = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Id',
                scope: {
                    $ref: '#/properties/id'
                }
            } as ControlElement,
            {
                type: 'Control',
                label: 'Name',
                scope: {
                    $ref: '#/properties/name'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('generate ui schema for schema with multiple properties', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'id': {
                'type': 'string',
                'format': 'objectId'
            },
            'lastName': {
                'type': 'string'
            },
            'email': {
                'type': 'string'
            },
            'firstName': {
                'type': 'string'
            },
            'gender': {
                'type': 'string',
                'enum': [
                    'Male',
                    'Female'
                ]
            },
            'active': {
                'type': 'boolean'
            },
            'registrationTime': {
                'type': 'string',
                'format': 'date-time'
            },
            'weight': {
                'type': 'number'
            },
            'height': {
                'type': 'integer'
            },
            'nationality': {
                'type': 'string',
                'enum': [
                    'German',
                    'French',
                    'UK',
                    'US',
                    'Spanish',
                    'Italian',
                    'Russian'
                ]
            },
            'birthDate': {
                'type': 'string',
                'format': 'date-time'
            }
        },
        'additionalProperties': false,
        'required': [
            'id',
            'lastName',
            'email'
        ]
    };
    const uiSchema: Layout = {
        'type': 'VerticalLayout',
        'elements': [
            {
                'type': 'Control',
                'label': 'Id',
                'scope': {
                    '$ref': '#/properties/id'
                }
            },
            {
                'type': 'Control',
                'label': 'Last Name',
                'scope': {
                    '$ref': '#/properties/lastName'
                }
            },
            {
                'type': 'Control',
                'label': 'Email',
                'scope': {
                    '$ref': '#/properties/email'
                }
            },
            {
                'type': 'Control',
                'label': 'First Name',
                'scope': {
                    '$ref': '#/properties/firstName'
                }
            },
            {
                'type': 'Control',
                'label': 'Gender',
                'scope': {
                    '$ref': '#/properties/gender'
                }
            },
            {
                'type': 'Control',
                'label': 'Active',
                'scope': {
                    '$ref': '#/properties/active'
                }
            },
            {
                'type': 'Control',
                'label': 'Registration Time',
                'scope': {
                    '$ref': '#/properties/registrationTime'
                }
            },
            {
                'type': 'Control',
                'label': 'Weight',
                'scope': {
                    '$ref': '#/properties/weight'
                }
            },
            {
                'type': 'Control',
                'label': 'Height',
                'scope': {
                    '$ref': '#/properties/height'
                }
            },
            {
                'type': 'Control',
                'label': 'Nationality',
                'scope': {
                    '$ref': '#/properties/nationality'
                }
            },
            {
                'type': 'Control',
                'label': 'Birth Date',
                'scope': {
                    '$ref': '#/properties/birthDate'
                }
            },
        ] as Array<ControlElement>
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('generate named array control', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'comments': {
                'type': 'array',
                'items': {
                    'properties': {
                        'msg': {'type': 'string'}
                    }
                }
            }
        }
    };
    const uiSchema: Layout = {
        'type': 'VerticalLayout',
        'elements': [
            {
                'label': 'Comments',
                'type': 'Control',
                'scope': {
                    '$ref': '#/properties/comments'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

test('generate unnamed array control', t => {
    const schema: JsonSchema = {
        'type': 'array',
        'items': {
            'properties': {
                'msg': {'type': 'string'}
            }
        }
    };
    const uiSchema: Layout = {
        'type': 'VerticalLayout',
        'elements': [
            {
                'label': '',
                'type': 'Control',
                'scope': {
                    '$ref': '#'
                }
            } as ControlElement
        ]
    };
    t.deepEqual(generateDefaultUISchema(schema), uiSchema);
});

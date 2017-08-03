"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const ui_schema_gen_1 = require("../src/generators/ui-schema-gen");
ava_1.default('generate ui schema for schema w/o properties', t => {
    const schema = {
        type: 'object'
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: []
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema with one property', t => {
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const control = {
        type: 'Control',
        label: 'Name',
        scope: {
            $ref: '#/properties/name'
        }
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [control]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema without object root', t => {
    const schema = {
        type: 'string'
    };
    const control = {
        label: '',
        type: 'Control',
        scope: {
            $ref: '#'
        }
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [control]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema with unspecified object root', t => {
    const schema = {
        properties: {
            age: {
                type: 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        label: 'Age',
        scope: {
            $ref: '#/properties/age'
        }
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [controlElement]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default(`nested object attributes`, t => {
    const schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            private: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            }
        }
    };
    const idControl = {
        type: 'Control',
        label: 'Id',
        scope: {
            $ref: '#/properties/id'
        }
    };
    const privateLabel = {
        type: 'Label',
        text: 'Private'
    };
    const nameControl = {
        type: 'Control',
        label: 'Name',
        scope: {
            $ref: '#/properties/private/properties/name'
        }
    };
    const nestedLayout = {
        type: 'VerticalLayout',
        elements: [
            privateLabel,
            nameControl,
        ]
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [
            idControl,
            nestedLayout
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default(`don't ignore non-json-schema id attributes`, t => {
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
    const idControl = {
        type: 'Control',
        label: 'Id',
        scope: {
            $ref: '#/properties/id'
        }
    };
    const nameControl = {
        type: 'Control',
        label: 'Name',
        scope: {
            $ref: '#/properties/name'
        }
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [
            idControl,
            nameControl
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema with multiple properties', t => {
    const schema = {
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
    const uiSchema = {
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
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate named array control', t => {
    const schema = {
        type: 'object',
        properties: {
            comments: {
                type: 'array',
                items: {
                    properties: {
                        msg: { type: 'string' }
                    }
                }
            }
        }
    };
    const control = {
        label: 'Comments',
        type: 'Control',
        scope: {
            $ref: '#/properties/comments'
        }
    };
    const uiSchema = {
        'type': 'VerticalLayout',
        'elements': [control]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate unnamed array control', t => {
    const schema = {
        type: 'array',
        items: {
            properties: {
                msg: { 'type': 'string' }
            }
        }
    };
    const control = {
        label: '',
        type: 'Control',
        scope: {
            '$ref': '#'
        }
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [control]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate unnamed array control w/o type', t => {
    const schema = {
        'items': {
            'properties': {
                'msg': { 'type': 'string' }
            }
        }
    };
    const control = {
        label: '',
        type: 'Control',
        scope: {
            $ref: '#'
        }
    };
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [control]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate for empty schema', t => {
    const schema = {};
    const uiSchema = null;
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate for null schema', t => {
    const schema = null;
    const uiSchema = null;
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate for undefined schema', t => {
    const schema = undefined;
    const uiSchema = null;
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
//# sourceMappingURL=ui-schema-gen.test.js.map
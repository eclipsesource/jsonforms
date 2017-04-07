"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var ui_schema_gen_1 = require("../src/generators/ui-schema-gen");
ava_1.default('generate ui schema for schema w/o properties', function (t) {
    var schema = {
        type: 'object'
    };
    var uiSchema = {
        type: 'VerticalLayout',
        elements: []
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema with one property', function (t) {
    var schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    var uiSchema = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Name',
                scope: {
                    $ref: '#/properties/name'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema without object root', function (t) {
    var schema = {
        type: 'string'
    };
    var uiSchema = {
        type: 'VerticalLayout',
        elements: [
            {
                label: '',
                type: 'Control',
                scope: {
                    $ref: '#'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema with unspecified object root', function (t) {
    var schema = {
        properties: {
            age: {
                type: 'integer'
            }
        }
    };
    var uiSchema = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Age',
                scope: {
                    $ref: '#/properties/age'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default("nested object attributes", function (t) {
    var schema = {
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
    var uiSchema = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Id',
                scope: {
                    $ref: '#/properties/id'
                }
            },
            {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'Label',
                        text: 'Private'
                    },
                    {
                        type: 'Control',
                        label: 'Name',
                        scope: {
                            $ref: '#/properties/private/properties/name'
                        }
                    }
                ]
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default("don't ignore non-json-schema id attributes", function (t) {
    var schema = {
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
    var uiSchema = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                label: 'Id',
                scope: {
                    $ref: '#/properties/id'
                }
            },
            {
                type: 'Control',
                label: 'Name',
                scope: {
                    $ref: '#/properties/name'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate ui schema for schema with multiple properties', function (t) {
    var schema = {
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
    var uiSchema = {
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
ava_1.default('generate named array control', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'comments': {
                'type': 'array',
                'items': {
                    'properties': {
                        'msg': { 'type': 'string' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'type': 'VerticalLayout',
        'elements': [
            {
                'label': 'Comments',
                'type': 'Control',
                'scope': {
                    '$ref': '#/properties/comments'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate unnamed array control', function (t) {
    var schema = {
        'type': 'array',
        'items': {
            'properties': {
                'msg': { 'type': 'string' }
            }
        }
    };
    var uiSchema = {
        'type': 'VerticalLayout',
        'elements': [
            {
                'label': '',
                'type': 'Control',
                'scope': {
                    '$ref': '#'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate unnamed array control w/o type', function (t) {
    var schema = {
        'items': {
            'properties': {
                'msg': { 'type': 'string' }
            }
        }
    };
    var uiSchema = {
        'type': 'VerticalLayout',
        'elements': [
            {
                'label': '',
                'type': 'Control',
                'scope': {
                    '$ref': '#'
                }
            }
        ]
    };
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate for empty schema', function (t) {
    var schema = {};
    var uiSchema = null;
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate for null schema', function (t) {
    var schema = null;
    var uiSchema = null;
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
ava_1.default('generate for undefined schema', function (t) {
    var schema = undefined;
    var uiSchema = null;
    t.deepEqual(ui_schema_gen_1.generateDefaultUISchema(schema), uiSchema);
});
//# sourceMappingURL=ui-schema-gen.test.js.map
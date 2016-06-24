import 'angular';
import 'angular-mocks';
import '../../index';

import {IUISchemaGenerator} from './generators';

describe('UISchemaGenerator', () => {

    let UISchemaGenerator: IUISchemaGenerator;

    beforeEach(angular.mock.module('jsonforms.form'));

    beforeEach(() => {
        angular.mock.inject(['UISchemaGenerator', (_UISchemaGenerator_: IUISchemaGenerator) =>
            UISchemaGenerator = _UISchemaGenerator_
        ]);
    });

    it('generate ui schema for schema w/o properties', () => {
        let schema = {
            type: 'object'
        };
        let uiSchema = {
            type: 'VerticalLayout',
            elements: []
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('generate ui schema for schema with one property', () => {
        let schema = {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        };
        let uiSchema = {
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
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('generate ui schema for schema without object root', () => {
        let schema = {
            type: 'string'
        };
        let uiSchema = {
            type: 'VerticalLayout',
            elements: [
                {
                    type: 'Control',
                    scope: {
                        $ref: '#'
                    }
                }
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('generate ui schema for schema with unspecified object root', () => {
        let schema = {
            properties: {
                age: {
                    type: 'integer'
                }
            }
        };
        let uiSchema = {
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
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('ignore json-schema id attributes', () => {
        let schema = {
            type: 'object',
            properties: {
                id: 'ignore me',
                name: {
                    type: 'string'
                }
            }
        };
        let uiSchema = {
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
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('dont ignore non-json-schema id attributes', () => {
        let schema = {
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
        let uiSchema = {
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
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('generate ui schema for schema with multiple properties', () => {
        let schema = {
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
        let uiSchema = {
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
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('generate named array control', () => {
        let schema = {
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
        let uiSchema = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Comments',
                    'scope': {
                        '$ref': '#/properties/comments'
                    }
                }
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it('generate unnamed array control', () => {
        let schema = {
            'type': 'array',
            'items': {
                'properties': {
                    'msg': {'type': 'string'}
                }
            }
        };
        let uiSchema = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': {
                        '$ref': '#'
                    }
                }
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

});

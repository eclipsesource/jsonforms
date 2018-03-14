"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms-examples.person', [])
    .value('person.schema', {
    'type': 'object',
    'properties': {
        'name': {
            'type': 'string',
            'minLength': 3
        },
        'personalData': {
            'type': 'object',
            'properties': {
                'age': {
                    'type': 'integer'
                },
                'height': {
                    'type': 'number'
                }
            },
            'required': ['age', 'height']
        },
        'vegetarian': {
            'type': 'boolean'
        },
        'birthDate': {
            'type': 'string',
            'format': 'date'
        },
        'nationality': {
            'type': 'string',
            'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        },
        'occupation': {
            'type': 'string'
        }
    },
    'required': ['occupation', 'nationality']
})
    .value('person.uischema', {
    'type': 'VerticalLayout',
    'elements': [
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': {
                        'text': 'Name',
                        'show': true
                    },
                    'scope': {
                        '$ref': '#/properties/name'
                    }
                },
                {
                    'type': 'Control',
                    'label': {
                        'text': 'Age'
                    },
                    'scope': {
                        '$ref': '#/properties/personalData/properties/age'
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Height',
                    'scope': {
                        '$ref': '#/properties/personalData/properties/height'
                    }
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Nationality',
                    'scope': {
                        '$ref': '#/properties/nationality'
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Occupation',
                    'scope': {
                        '$ref': '#/properties/occupation'
                    },
                    'suggestion': ['Accountant', 'Engineer', 'Freelancer',
                        'Journalism', 'Physician', 'Student', 'Teacher', 'Other']
                },
                {
                    'type': 'Control',
                    'label': 'Birthday',
                    'scope': {
                        '$ref': '#/properties/birthDate'
                    }
                }
            ]
        }
    ]
})
    .value('person.data', {
    name: 'John Doe',
    vegetarian: false,
    birthDate: '1985-06-02'
})
    .name;
//# sourceMappingURL=person.data.js.map
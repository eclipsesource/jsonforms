"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms-examples.async', [])
    .value('async.schema', {
    'type': 'object',
    'properties': {
        'name': {
            'type': 'string',
            'minLength': 3
        },
        'nationality': {
            'type': 'string',
            'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        }
    }
})
    .value('async.uischema', {
    'type': 'HorizontalLayout',
    'elements': [
        {
            'type': 'Control',
            'label': 'Name',
            'scope': {
                '$ref': '#/properties/name'
            }
        },
        {
            'type': 'Control',
            'label': 'Nationality',
            'scope': {
                '$ref': '#/properties/nationality'
            }
        }
    ]
})
    .value('async.data', {
    name: 'John Doe',
    nationality: 'US'
})
    .name;
//# sourceMappingURL=async.data.js.map
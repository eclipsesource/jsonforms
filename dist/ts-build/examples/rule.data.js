"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms-examples.rule', [])
    .value('rule.schema', {
    'type': 'object',
    'properties': {
        'name': {
            'type': 'string'
        },
        'alive': {
            'type': 'boolean'
        },
        'kindOfDead': {
            'type': 'string',
            'enum': ['Zombie', 'Vampire', 'Ghoul']
        }
    }
})
    .value('rule.uischema', {
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
            'label': 'Is Alive?',
            'scope': {
                '$ref': '#/properties/alive'
            }
        },
        {
            'type': 'Control',
            'label': 'Kind of dead',
            'scope': {
                '$ref': '#/properties/kindOfDead'
            },
            'rule': {
                'effect': 'SHOW',
                'condition': {
                    'type': 'LEAF',
                    'scope': {
                        '$ref': '#/properties/alive'
                    },
                    'expectedValue': false
                }
            }
        }
    ]
})
    .value('rule.data', {
    name: 'John Doe',
    alive: true,
    kindOfDead: 'Zombie'
})
    .name;
//# sourceMappingURL=rule.data.js.map
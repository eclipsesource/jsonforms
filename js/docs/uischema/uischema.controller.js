angular.module('jsonforms-website')
    .controller('UiSchemaController', function() {
        var vm = this;
        vm.example1 = {
            schema: {
                'type': 'object',
                'properties': {
                    'name': {  'type': 'string' }
                }
            },
            uischema: {
                'type': 'Control',
                'scope': { '$ref': '#/properties/name' }
            },
            data: {
                'name': 'Ottgar'
            }
        };
        vm.example2 = {
            schema: {
                'type': 'object',
                'properties': {
                    'name': {  'type': 'string' }
                }
            },
            uischema: {
                'type': 'Control',
                'readOnly': true,
                'scope': { '$ref': '#/properties/name' }
            },
            data: {
                'name': 'Ottgar'
            }
        };
        vm.example3 = {
            schema: {
                'properties': {
                    'some': {
                        'type': 'string',
                        'enum': ['foo', 'bar']
                    }
                }
            },
            uischema: {
                'type': 'Control',
                'scope': {'$ref': '#/properties/some'}
            },
            data: {
                'some': 'foo'
            }
        };
        vm.example4 = {
            schema: {
                'properties': {
                    'comments': {
                        'type': 'array',
                        'items': {
                            'properties': {
                                'message': {'type': 'string'}
                            }
                        }
                    }
                }
            },
            uischema: {
                'type': 'Control',
                'scope': {'$ref': '#/properties/comments'}
            },
            data: {
                comments: [{
                    message: 'Hello there'
                },{
                    message: 'Some more text'
                }]
            }
        }
    });


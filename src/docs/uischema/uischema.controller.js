'use strict';

var module = angular.module('docs.uischemacontroller',[]);

module
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

        //
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
        };

        vm.example4b = {
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
                'scope': {'$ref': '#/properties/comments'},
                'options': {
                    'submit': false
                }
            },
            data: {
                comments: [{
                    message: 'Hello there'
                },{
                    message: 'Some more text'
                }]
            }
        };

        // Array control with simple option set to true
        vm.example5 = {
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
                'scope': {'$ref': '#/properties/comments'},
                'options': {
                    'simple': true
                }
            },
            data: {
                comments: [{
                    message: 'Hello there'
                },{
                    message: 'Some more text'
                }]
            }
        };

        //
        // Layout Examples --
        //

        vm.layoutExamplesSchema = {
            'properties': {
                'foo': {'type': 'string'},
                'bar': {'type': 'string'}
            }
        };

        vm.layoutExamplesData =  {
            'foo': "This is a sample string",
            'bar': 'One more!'
        };

        // Horizontal Layout example with two controls
        vm.example6 = {
            schema: vm.layoutExamplesSchema,
            data: vm.layoutExamplesData,
            uischema: {
                'type': 'HorizontalLayout',
                'elements': [
                    {
                        'type': 'Control',
                        'scope': {'$ref': '#/properties/foo'}
                    },
                    {
                        'type': 'Control',
                        'scope': {'$ref': '#/properties/bar'}
                    }
                ]
            }
        };

        //
        vm.example7 = {
            schema:  vm.layoutExamplesSchema,
            data: vm.layoutExamplesData,
            uischema: {
                'type': 'VerticalLayout',
                'elements': [
                    {
                        'type': 'Control',
                        'scope': { '$ref': '#/properties/foo' }
                    },
                    {
                        'type': 'Control',
                        'scope': { '$ref': '#/properties/bar' }
                    }
                ]
            }
        };

        vm.example8 = {
            schema: vm.layoutExamplesSchema,
            data: vm.layoutExamplesData,
            uischema: {
                'type': 'Group',
                'label': 'Some title',
                'elements': [
                    {
                        'type': 'Control',
                        'scope': {'$ref': '#/properties/foo'}
                    },
                    {
                        'type': 'Control',
                        'scope': {'$ref': '#/properties/bar'}
                    }
                ]
            }
        };

        vm.example9 = {
            schema: vm.layoutExamplesSchema,
            data: vm.layoutExamplesData,
            uischema: {
                'type': 'Categorization',
                'elements': [
                    {
                        'type': 'Category',
                        'label': 'Pets',
                        'elements': [
                            {
                                'type': 'Control',
                                'scope': {
                                    '$ref': '#/properties/foo'
                                }
                            }
                        ]
                    },
                    {
                        'type': 'Category',
                        'label': 'Cars',
                        'elements': [
                            {
                                'type': 'Control',
                                'scope': {
                                    '$ref': '#/properties/bar'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    });

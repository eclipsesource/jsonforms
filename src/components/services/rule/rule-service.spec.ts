import 'angular';
import 'angular-mocks';
import '../../../index';

import IRootScopeService = angular.IRootScopeService;
import ICompileService = angular.ICompileService;

describe('RuleServiceTest', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('rule evaluated on VerticalLayout',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

            let scope = $rootScope.$new();
            scope['schema'] = {
                'properties': {
                    'name': {
                        'type': 'string'
                    },
                    'age': {
                        'type': 'number'
                    }
                }
            };
            scope['uiSchema'] = {
                'type': 'VerticalLayout',
                'elements': [],
                'rule': {
                    'effect': 'HIDE',
                    'condition': {
                        'type': 'LEAF',
                        'scope': {
                            '$ref': '#/properties/age'
                        },
                        'expectedValue': 36
                    }
                }
            };
            scope['data'] = { 'name': 'John Doe', 'age': 36 };
            let el =
                $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            expect(angular.element(el[0].querySelector('form  div')).hasClass('ng-hide'))
                .toBe(true);
        }));

    it('rule Hide evaluated on startup',
        angular.mock.inject(function($rootScope, $compile) {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                }
            }
        };
        scope.uiSchema = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/name' },
                    'rule': {
                        'effect': 'HIDE',
                        'condition': {
                            'type': 'LEAF',
                            'scope': {
                                '$ref': '#/properties/age'
                            },
                            'expectedValue': 36
                        }
                    }
                },
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/age' },
                }
            ]
        };
        scope.data = { 'name': 'John Doe', 'age': 36 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(
            angular.element(el[0].querySelector('#\\#\\/properties\\/name').parentNode.parentNode)
            .hasClass('ng-hide')
        ).toBe(true);
    }));

    it('rule Hide evaluated on startup single control',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

        let scope = $rootScope.$new();
        scope['schema'] = {
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                }
            }
        };
        scope['uiSchema'] = {
            'type': 'Control',
            'scope': { '$ref': '#/properties/name' },
            'rule': {
                'effect': 'HIDE',
                'condition': {
                    'type': 'LEAF',
                    'scope': {
                        '$ref': '#/properties/age'
                    },
                    'expectedValue': 36
                }
            }
        };
        scope['data'] = { 'name': 'John Doe', 'age': 36 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(
            angular.element(el[0].querySelector('#\\#\\/properties\\/name').parentNode.parentNode)
            .hasClass('ng-hide')
        ).toBe(true);
    }));

    it('rule Show evaluated on startup',

        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {
        let scope = $rootScope.$new();
        scope['schema'] = {
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                }
            }
        };
        scope['uiSchema'] = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/name' },
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'type': 'LEAF',
                            'scope': {
                                '$ref': '#/properties/age'
                            },
                            'expectedValue': 36
                        }
                    }
                },
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/age' },
                }
            ]
        };
        scope['data'] = { 'name': 'John Doe', 'age': 37 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(
            angular.element(el[0].querySelector('#\\#\\/properties\\/name').parentNode.parentNode)
            .hasClass('ng-hide')
        ).toBe(true);
    }));

    it('rule Show evaluated on startup single control',

        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {
        let scope = $rootScope.$new();
        scope['schema'] = {
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                }
            }
        };
        scope['uiSchema'] = {
            'type': 'Control',
            'scope': { '$ref': '#/properties/name' },
            'rule': {
                'effect': 'SHOW',
                'condition': {
                    'type': 'LEAF',
                    'scope': {
                        '$ref': '#/properties/age'
                    },
                    'expectedValue': 36
                }
            }
        };
        scope['data'] = { 'name': 'John Doe', 'age': 37 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(
            angular.element(el[0].querySelector('#\\#\\/properties\\/name').parentNode.parentNode)
            .hasClass('ng-hide')
        ).toBe(true);
    }));

    it('rule Hide dynamic',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

        let scope = $rootScope.$new();
        scope['schema'] = {
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                }
            }
        };
        scope['uiSchema'] = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/name' },
                    'rule': {
                        'effect': 'HIDE',
                        'condition': {
                            'type': 'LEAF',
                            'scope': {
                                '$ref': '#/properties/age'
                            },
                            'expectedValue': 36
                        }
                    }
                },
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/age' },
                }
            ]
        };
        scope['data'] = { 'name': 'John Doe', 'age': 36 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let name = el[0].querySelector('#\\#\\/properties\\/name');
        let age = el[0].querySelector('#\\#\\/properties\\/age');
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(true);
        angular.element(age).val('37').triggerHandler('change');
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(false);
    }));

    it('rule Show dynamic',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {
        let scope = $rootScope.$new();
        scope['schema'] = {
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                }
            }
        };
        scope['uiSchema'] = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/name' },
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'type': 'LEAF',
                            'scope': {
                                '$ref': '#/properties/age'
                            },
                            'expectedValue': 36
                        }
                    }
                },
                {
                    'type': 'Control',
                    'scope': { '$ref': '#/properties/age' },
                }
            ]
        };
        scope['data'] = { 'name': 'John Doe', 'age': 37 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let name = el[0].querySelector('#\\#\\/properties\\/name');
        let age = el[0].querySelector('#\\#\\/properties\\/age');
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(true);
        angular.element(age).val('36').triggerHandler('change');
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(false);
    }));
});

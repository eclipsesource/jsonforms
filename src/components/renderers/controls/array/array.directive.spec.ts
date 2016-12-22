import 'angular';
import 'angular-mocks';
import '../../../../index.ts';

import IRootScopeService = angular.IRootScopeService;
import ICompileService = angular.ICompileService;
import {JsonFormsScope} from "../../../../index";

describe('Array renderer', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should render elements',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

        let scope: JsonFormsScope = <JsonFormsScope> $rootScope.$new();
        scope.schema = {
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
        scope.uiSchema = { 'type': 'Control', 'scope': { '$ref': '#/properties/comments' } };
        scope.data = {'comments': [{'msg': 'Some message'}, {'msg': 'Another message'}]};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].getElementsByTagName('jsonforms-layout').length)[0]).toBe(3);
    }));

    it('should render an empty array',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {
        let scope = $rootScope.$new();
        scope['schema'] = {
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
        scope['uiSchema'] = {
            'type': 'Control',
            'scope': { '$ref': '#/properties/comments' },
            'options': {
                'submit': true
            }
        };
        scope['data'] = {};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].getElementsByTagName('jsonforms-layout').length)[0]).toBe(1);
    }));

    it('should create an array if it is undefined',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {
        let scope = $rootScope.$new();
        scope['schema'] = {
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
        scope['uiSchema'] = {
            'type': 'Control',
            'scope': { '$ref': '#/properties/comments' },
            'options': {
                'submit': true
            }
        };
        scope['data'] = {};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(scope['data']['comments']).toBeUndefined();
        let button = el.find('input.btn');
        button.triggerHandler('click');
        expect(scope['data']['comments']).toBeDefined();
    }));

    it('should be capable of rendering an array as read-only',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

        let scope = $rootScope.$new();
        scope['schema'] = {
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
        scope['uiSchema'] = {
            'type': 'Control',
            'scope': { '$ref': '#/properties/comments' },
            'readOnly': true,
            'options': {
                'submit': true
            }
        };
        scope['data'] = {};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let fieldSet = angular.element(el[0].getElementsByTagName('fieldset'));
        expect(fieldSet.attr('disabled')).toBeDefined();
    }));

    it('should be capable of rendering a functional delete button',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

            let scope = $rootScope.$new();
            scope['schema'] = {
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
            scope['uiSchema'] = {
                'type': 'Control',
                'scope': { '$ref': '#/properties/comments' },
                'options': {
                    'submit': true,
                    'delete': true
                }
            };
            scope['data'] = {'comments': [{'msg': 'Some message'}, {'msg': 'Another message'}]};
            let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            expect(scope['data']['comments'].length).toEqual(2);
            let button = el.find('div.jsf-control-array-element-delete > input.btn').first();
            button.triggerHandler('click');
            expect(scope['data']['comments'].length).toEqual(1);
        }));

    it('should not render delete button when disabled',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

            let scope = $rootScope.$new();
            scope['schema'] = {
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
            scope['uiSchema'] = {
                'type': 'Control',
                'scope': { '$ref': '#/properties/comments' },
                'options': {
                    'submit': true,
                    'delete': false
                }
            };
            scope['data'] = {'comments': [{'msg': 'Some message'}, {'msg': 'Another message'}]};
            let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            // check if ng-hide is set on the delete buttons
            let deleteButtons = el.find('div.jsf-control-array-element-delete > input.ng-hide');
            expect(deleteButtons.length).toEqual(2);
        }));

    it('should not render submit button when disabled',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

            let scope = $rootScope.$new();
            scope['schema'] = {
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
            scope['uiSchema'] = {
                'type': 'Control',
                'scope': { '$ref': '#/properties/comments' },
                'options': {
                    'submit': false,
                    'delete': true
                }
            };
            scope['data'] = {'comments': [{'msg': 'Some message'}, {'msg': 'Another message'}]};
            let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            // check if ng-hide is set on submit button
            let submitButton = el.find('fieldset > input.ng-hide');
            expect(submitButton.length).toEqual(1);
        }));
});

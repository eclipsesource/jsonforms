import 'angular';
import 'angular-mocks';
import '../../../../index';
import {DataService} from '../../../ng-services/data/data.service';

describe('MasterDetail', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('object should be rendered',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'type': 'object',
            'properties': {
                'a': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                        }
                    },
                },
                'c': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                        }
                    }
                },
            }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            },
            'options':{}
        };
        scope.data = {
            'a': [
                    {'name': 'x_1'},
                    {'name': 'x_2'}
                ],
            'c': [
                    {'name': 'y_1'},
                    {'name': 'y_2'}
                ]
            };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('<!-- Master -->'); // this is not resolved completly
        expect(el.html()).toContain('<!-- Detail -->'); // this is not resolved completly
        expect(el.html()).toContain('a');
        expect(el.html()).toContain('x_1');
        expect(el.html()).toContain('x_2');
        expect(el.html()).toContain('c');
        expect(el.html()).toContain('y_1');
        expect(el.html()).toContain('y_2');
        expect(el.html()).not.toContain('Add Root Item');

        let nameInput_empty = el[0].querySelector('#\\#\\/properties\\/name');
        expect(nameInput_empty).toBeNull();

        let x1 = el[0].querySelector('span.jsf-masterdetail-entry');
        angular.element(x1).triggerHandler('click');
        expect(el.html()).toContain('<label');
        let nameInput = el[0].querySelector('#\\#\\/properties\\/name');
        expect(nameInput).not.toBeNull();

        expect(DataService.getRoot()).toBe(scope.data);
    }));
    it('array should be rendered',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'a': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'id': 'a',
                            'properties': {
                                'custom': {
                                    'type': 'string'
                                },
                            }
                        },
                    },
                    'c': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'id': 'c',
                            'properties': {
                                'custom': {
                                    'type': 'string'
                                },
                            }
                        }
                    }
                }
            }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            },
            'options' : {
                'labelProvider': {'a': 'custom', 'c': 'custom'},
                'imageProvider': {'a': 'myImageAUrl', 'c': 'myImageBUrl'}
            }
        };
        scope.data = [
            {
                'a': [
                        {'custom': 'x_1'},
                        {'custom': 'x_2'}
                    ],
                'c': [
                        {'custom': 'y_1'},
                        {'custom': 'y_2'}
                    ]
            },
            {
                'a': [
                        {'custom': 'x_3'},
                        {'custom': 'x_4'}
                    ],
                'c': [
                        {'custom': 'y_3'},
                        {'custom': 'y_4'}
                    ]
                }
        ];
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('<!-- Master -->'); // this is not resolved completly
        expect(el.html()).toContain('<!-- Detail -->'); // this is not resolved completly
        expect(el.html()).toContain('x_1');
        expect(el.html()).toContain('x_2');
        expect(el.html()).toContain('y_1');
        expect(el.html()).toContain('y_2');
        expect(el.html()).toContain('x_3');
        expect(el.html()).toContain('x_4');
        expect(el.html()).toContain('y_3');
        expect(el.html()).toContain('y_4');
        expect(el.html()).toContain('src="myImageAUrl"');
        expect(el.html()).toContain('src="myImageBUrl"');


        let nameInput_empty = el[0].querySelector('#\\#\\/properties\\/custom');
        expect(nameInput_empty).toBeNull();

        let x1 = el[0].querySelector('span.jsf-masterdetail-entry');
        angular.element(x1).triggerHandler('click');
        expect(el.html()).toContain('<label');
        let nameInput = el[0].querySelector('#\\#\\/properties\\/custom');
        expect(nameInput).not.toBeNull();

        expect(DataService.getRoot()).toBe(scope.data);
    }));

    it('array should allow to add root',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                  'name': {
                      'type': 'string'
                  }
                }
            }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            }
        };
        scope.data = [{'name': 'x'}];
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let addToRoot = el[0].querySelector('span.jsf-masterdetail-addRoot');
        angular.element(addToRoot).triggerHandler('click');

        expect(scope.data.length).toBe(2);
    }));

    it('array should allow to remove root',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                  'name': {
                      'type': 'string'
                  }
                }
            }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            }
        };
        scope.data = [{'name': 'x'}];
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let addToRoot = el[0].querySelector('span.jsf-masterdetail-entry-remove');
        angular.element(addToRoot).triggerHandler('click');

        expect(scope.data.length).toBe(0);
    }));

    it('should allow to add to undefined',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
          'type': 'object',
          'properties': {
            'a': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'name': {
                    'type': 'string'
                  }
                }
              }
            }
          }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            },
        };
        scope.data = {};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let addTo = el[0].querySelector('span.jsf-masterdetail-entry-add');
        angular.element(addTo).triggerHandler('click');
        let selectKey = el[0].querySelector('.selectKeyForAdd li');
        angular.element(selectKey).triggerHandler('click');

        expect(scope.data['a'].length).toBe(1);
    }));

    it('should allow to add additional',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
          'type': 'object',
          'properties': {
            'a': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'name': {
                    'type': 'string'
                  }
                }
              }
            }
          }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            },
        };
        scope.data = {'a': [{'name': 'x'}]};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let addTo = el[0].querySelector('span.jsf-masterdetail-entry-add');
        angular.element(addTo).triggerHandler('click');
        let selectKey = el[0].querySelector('.selectKeyForAdd li');
        angular.element(selectKey).triggerHandler('click');

        expect(scope.data['a'].length).toBe(2);
    }));

    it('should allow to remove',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
          'type': 'object',
          'properties': {
            'a': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'name': {
                    'type': 'string'
                  }
                }
              }
            }
          }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            },
        };
        scope.data = {'a': [{'name': 'x'}]};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let remove = el[0].querySelector('span.jsf-masterdetail-entry-remove');
        angular.element(remove).triggerHandler('click');

        expect(scope.data['a'].length).toBe(0);
    }));
});

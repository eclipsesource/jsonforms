import 'angular';
import 'angular-mocks';
import '../../index';

describe('jsonforms directive', () => {
    let originalTimeout;
    // load all necessary modules and templates
    beforeEach(() => {
        angular.mock.module('jsonforms.form');
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should resolve local references', function(done) {
        inject(function ($rootScope, $compile) {
            let scope = $rootScope.$new();
            scope.schema = {
                'definitions': {
                    'address': {
                      'type': 'object',
                      'properties': {
                        'street': { 'type': 'string' },
                      }
                  }
                },

                'type': 'object',
                'properties': {
                    'address': { '$ref': '#/definitions/address' }
                }
            };
            scope.data = {};
            scope.uiSchema = {
                'type': 'Control',
                'scope': {
                    '$ref': '#/properties/address/properties/street'
                }
            };
            let el = $compile('<jsonforms schema="schema" data="data" uischema="uiSchema">')
                (scope);
            scope.$digest();
            setTimeout(() => {
                expect(el.find('label').text()).toEqual('Street');
                done();
            });
        });
    });

    it('should resolve remote references', function(done) {
        inject(function ($rootScope, $compile) {
            let scope = $rootScope.$new();
            scope.schema = {
                'type': 'object',
                'properties': {
                    'coord': {'$ref': 'http://json-schema.org/geo'}
                }
            };
            scope.data = {};
            scope.uiSchema = {
                'type': 'Control',
                'scope': {
                    '$ref': '#/properties/coord/properties/longitude'
                }
            };
            let el = $compile('<jsonforms schema="schema" data="data" uischema="uiSchema">')
                (scope);
            scope.$digest();
            // debugger;
            setTimeout(() => {
                expect(el.find('label').text()).toEqual('Longitude');
                done();
            }, 2000);
        });
    });

    it('should render a labeled select field', inject(function ($rootScope, $compile) {
        let scope = $rootScope.$new();
        scope.schema = {
            'type': 'object',
            'properties': {
                'gender': {
                    'type': 'string',
                    'enum': ['Male', 'Female']
                }
            }
        };
        scope.data = { gender: 'Female'};
        scope.uiSchema = {
            'type': 'Control',
            'label': 'Gender',
            'scope': { '$ref': '#/properties/gender' }
        };
        let el = $compile('<jsonforms schema="schema" data="data" uischema="uiSchema">')(scope);
        scope.$digest();
        // should test for more complex logic here
        expect(el.find('label').text()).toEqual('Gender');
        expect(el.find('select')).toBeDefined();
    }));

    it('should throw an error in case the data attribute is missing',
        inject(function($rootScope, $compile) {
        let scope = $rootScope.$new();
        scope.schema = {};
        scope.uiSchema = {};
        expect(function() {
            $compile('<jsonforms schema="schema" uischema="uiSchema"/>')(scope);
            scope.$digest();
        }).toThrow(Error(`The 'data' attribute must be specified.`));
    }));

    it('should created nested objects', inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'personalData': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string'
                        }
                    }
                }
            }
        };
        scope.uiSchema = {
            'type': 'Control',
            'scope': {
                '$ref': '#/properties/personalData/properties/name'
            }
        };
        scope.data = { }; // empty data
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = el.find('input');
        input.val('John Doe').triggerHandler('input');
        expect(scope.data.personalData).toBeDefined();
    }));
});

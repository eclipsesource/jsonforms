import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('LabelElement', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should be rendered',
        angular.mock.inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {}
        };
        scope.uiSchema = { 'type': 'Label', 'text': 'My Label' };
        scope.data = { 'name': 'John Doe '};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('My Label');
    }));


    it('should be generated automatically',
        angular.mock.inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'name': {
                    'type': 'string'
                }
            }
        };
        scope.uiSchema = { 'type': 'Control', 'scope': { '$ref': '#/properties/name' } };
        scope.data = { 'name': 'John Doe '};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('Name');
    }));

    it('should be able to specify custom label attribute',
        angular.mock.inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'name': {
                    'type': 'string'
                }
            }
        };
        scope.uiSchema = {
            'type': 'Control',
            'label': 'This is a custom label',
            'scope': { '$ref': '#/properties/name' }
        };
        scope.data = { 'name': 'John Doe '};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('This is a custom label');
    }));

    it('should be annotated in case the property the control is pointing to is required',
        angular.mock.inject(($rootScope, $compile) => {
            let scope = $rootScope.$new();
            scope.schema = {
                'properties': {
                    'name': {
                        'type': 'string'
                    }
                },
                'required': ['name']
            };
            scope.uiSchema = {
                'type': 'Control',
                'scope': { '$ref': '#/properties/name' }
            };
            scope.data = { 'name': 'John Doe '};
            let el =
                $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            let label = el.find('label');
            expect(label.text()).toBe('Name*');
        }));
});

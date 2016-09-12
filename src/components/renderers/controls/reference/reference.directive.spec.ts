import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('Reference control', () => {

    beforeEach(angular.mock.module('jsonforms.form'));

    it('should create a valid href',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'name': { 'type': 'string' },
                'someId': { 'type': 'string' }
            }
        };
        scope.uiSchema =  {
            'type': 'ReferenceControl',
            'scope': { '$ref': '#/properties/someId' },
            'href': {
                'url': '/fake'
            }
        };
        scope.data = {
            'name': 'John Doe',
            'someId': 3
        };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let a = el.find('a');
        expect(a.attr('href')).toBe('#/fake/3');
        expect(a.text()).toBe('Some Id');
    }));

    it('should support customizable via a label properties',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'name': { 'type': 'string' },
                'someId': { 'type': 'string' }
            }
        };
        scope.uiSchema =  {
            'type': 'ReferenceControl',
            'scope': { '$ref': '#/properties/someId' },
            'label': 'Navigate to ',
            'href': {
                'url': '/fake',
                'label': 'Parent'
            }
        };
        scope.data = {
            'name': 'John Doe',
            'someId': 3
        };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let a = el.find('a');
        expect(a.text()).toBe('Parent');
        expect(a.parent().html()).toContain('Navigate to');
    }));
});

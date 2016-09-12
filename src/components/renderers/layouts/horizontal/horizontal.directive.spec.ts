import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('HorizontalLayout', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should take into account if some labels are hidden',

        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'foo': { 'type': 'string' },
                'bar': { 'type': 'string' }
            }
        };
        scope.uiSchema = {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': true,
                    'scope': { '$ref': '#/properties/foo' }
                },
                {
                    'type': 'Control',
                    'label': false,
                    'scope': { '$ref': '#/properties/bar' }
                }
            ]
        };

        scope.data = { 'foo': 'quux', 'bar': 'baz' };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let labelElements = el.find('label');
        expect(labelElements).toBeDefined();
        // one label is empty
        expect(labelElements.length).toEqual(2);
        expect(angular.element(labelElements[0]).text()).toEqual('Foo');
        expect(angular.element(labelElements[1]).text()).toEqual('');
    }));

    it('should take into account if all labels are hidden', inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'foo': { 'type': 'string' },
                'bar': { 'type': 'string' }
            }
        };
        scope.uiSchema = {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': {
                        show: false
                    },
                    'scope': { '$ref': '#/properties/foo' }
                },
                {
                    'type': 'Control',
                    'label': {
                        show: false
                    },
                    'scope': { '$ref': '#/properties/bar' }
                }
            ]
        };

        scope.data = { 'foo': 'quux', 'bar': 'baz' };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let labelElements = el.find('label');
        expect(labelElements.length).toBe(0);
    }));
});

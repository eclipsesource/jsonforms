import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('String renderer', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should support read-only flag',
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
            'readOnly': true,
            'scope': { '$ref': '#/properties/name' }
        };
        scope.data = { 'vegetarian': true };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control-string'));
        expect(input.attr('readonly')).toBeDefined();
    }));

    it('should support text-areas if multi option is set',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'name': {
                    'type': 'string',
                },
            }
        };
        scope.uiSchema = {
            'type': 'Control',
            'readOnly': true,
            'scope': { '$ref': '#/properties/name' },
            'options': {
                'multi': true
            }
        };
        scope.data = { 'vegetarian': true };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control-string'));
        expect(input.prop('tagName')).toBe('TEXTAREA');
    }));
});

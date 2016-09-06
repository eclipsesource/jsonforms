import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('Number renderer', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should support read-only flag',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'height': {
                    'type': 'number'
                }
            }
        };
        scope.uiSchema = {
            'type': 'Control',
            'readOnly': true,
            'scope': { '$ref': '#/properties/height' }
        };
        scope.data = { 'height': 1.76 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control-number'));
        expect(input.attr('readonly')).toBeDefined();
    }));
});

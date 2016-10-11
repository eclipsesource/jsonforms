import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('DateTimeTest', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    let schema = {
            'properties': {
                'birthDate': {
                    'type': 'string',
                    'format': 'date'
                }
            }
        };

    it('should be rendered',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = schema;
        scope.uiSchema = { 'type': 'Control', 'scope': { '$ref': '#/properties/birthDate' } };
        scope.data = { 'birthDate': new Date() };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('input type="date"');
    }));

    it('should support read-only flag',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = schema;
        scope.uiSchema = {
            'type': 'Control',
            'readOnly': true,
            'scope': { '$ref': '#/properties/birthDate' }
        };
        scope.data = { 'birthDate': '1985-06-02 20:15:36' };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control-datetime'));
        expect(input.attr('readonly')).toBeDefined();
    }));

    // TODO: add test cases to check whether validation works
});

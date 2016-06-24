import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('VerticalLayout', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should not support labels',
        angular.mock.inject(($rootScope, $compile) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'foo': { 'type': 'string' }
            }
        };
        scope.uiSchema = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': {
                        '$ref': '#/properties/foo'
                    }
                }
            ]
        };
        scope.data = { 'name': 'John Doe '};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let layout = el.find('div');
        expect(layout.hasClass('jsf-vertical-layout')).toBeTruthy();
    }));
});

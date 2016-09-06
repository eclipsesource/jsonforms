import 'angular';
import 'angular-mocks';

describe('Group', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should support labels 2', inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            'properties': {
                'foo': { 'type': 'string' }
            }
        };
        scope.uiSchema = {
            'type': 'Group',
            'label': 'woot',
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
        let div = el.find('div');
        expect(div.hasClass('jsf-group')).toBeTruthy();
    }));
});

import 'angular';
import 'angular-mocks';
import '../../../../index';

describe('Enum', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    let schema = {
        'properties': {
            'some': {
                'type': 'string',
                'enum': ['foo', 'bar']
            }
        }
    };

    it('should be rendered',
        angular.mock.inject(($rootScope, $compile) => {

            let scope = $rootScope.$new();
            scope.schema = schema;
            scope.uiSchema = {'type': 'Control', 'scope': {'$ref': '#/properties/some'}};
            scope.data = {'some': 'foo' }
            let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
            scope.$digest();
            expect(el.html()).toContain('select');
        }));
}
);

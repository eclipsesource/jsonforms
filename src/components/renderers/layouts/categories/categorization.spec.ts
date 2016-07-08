import 'angular';
import 'angular-mocks';
import '../../../../index.ts';

describe('Categorization', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should be rendered',
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
            'type': 'Categorization',
            'elements': [
                {
                    'type': 'Category',
                    'label': 'Tab1',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Name',
                            'scope': {
                                '$ref': '#/properties/name'
                            }
                        },
                    ]
                },
                {
                    'type': 'Category',
                    'label': 'MyTab2',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Name',
                            'scope': {
                                '$ref': '#/properties/name'
                            }
                        },
                    ]
                },
            ]
        };
        scope.data = { 'name': 'John Doe '};
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toMatch(/>\s*Tab1\s*<\/span>/);
        expect(el.html()).toMatch(/>\s*MyTab2\s*<\/span>/);
    }));
});

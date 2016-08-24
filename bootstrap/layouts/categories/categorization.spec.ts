import 'angular';
import 'angular-mocks';
import '../../jsonforms-bootstrap.ts';

describe('CategorizationBootstrap', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    xit('should be rendered',
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
        expect(el.html()).toContain('</uib-tabset>'); // this is not resolved completly
        expect(el.html()).toContain('</uib-tab>'); // this is not resolved completly
        expect(el.html()).toContain('heading="Tab1"');
        expect(el.html()).toContain('heading="MyTab2"');
    }));
});

import 'angular';
import 'angular-mocks';

import IRootScopeService = angular.IRootScopeService;
import ICompileService = angular.ICompileService;

describe('Renderer service', () => {


    beforeEach(angular.mock.module('jsonforms.form'));

    xit('should support remote references',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

        let scope = $rootScope.$new();
        // empty schema
        scope['schema'] = {};
        scope['uiSchema'] = {
            'type': 'Control',
            'scope': {
                '$ref': 'http://json-schema.org/geo#/latitude'
            }
        };
        scope['data'] = { 'latitude': 42 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control-number'));
        expect(input).toBeDefined();
    }));
});

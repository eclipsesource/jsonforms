import 'angular';
import 'angular-mocks';
import '../../index';
import IRootScopeService = angular.IRootScopeService;
import ICompileService = angular.ICompileService;

describe('Renderer service', () => {


    beforeEach(angular.mock.module('jsonforms.form'));

    it('should support remote references',
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

    it('should add comment to dom on unknown renderer',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {

        let scope = $rootScope.$new();
        // empty schema
        scope['schema'] = {};
        scope['uiSchema'] = {
            'type': 'UNKNOWN_CONTROL',
            'scope': {
                '$ref': 'http://json-schema.org/geo#/latitude'
            }
        };
        scope['data'] = { 'latitude': 42 };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('No Renderer for UNKNOWN_CONTROL.');
    }));
});

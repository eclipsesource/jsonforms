import 'angular';
import 'angular-mocks';
import '../../../../index';

import IRootScopeService = angular.IRootScopeService;
import ICompileService = angular.ICompileService;
import {JsonFormsScope} from "../../../../index";

describe('Boolean renderer', () => {

    beforeEach(angular.mock.module('jsonforms.form'));

    it('should support read-only flag',
        angular.mock.inject(($rootScope: IRootScopeService, $compile: ICompileService) => {
        let scope = <JsonFormsScope> $rootScope.$new();
        scope.schema = {
            'properties': {
                'vegetarian': {
                    'type': 'boolean',
                }
            }
        };
        scope.uiSchema = {
            'type': 'Control',
            'readOnly': true,
            'scope': { '$ref': '#/properties/vegetarian'}
        };
        scope.data = { 'vegetarian': true };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let input = angular.element(el[0].getElementsByClassName('jsf-control-boolean'));
        expect(input.attr('disabled')).toBeDefined();
    }));
});

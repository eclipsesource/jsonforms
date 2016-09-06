import 'angular';
import 'angular-mocks';
import '../../../../index';
import {DataService} from "../../../ng-services/data/data.service";

describe('MasterDetail', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    it('should be rendered',
        angular.mock.inject(($rootScope, $compile, DataService: DataService) => {

        let scope = $rootScope.$new();
        scope.schema = {
            'type': 'object',
            'properties': {
                'a': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                        }
                    },
                },
                'c': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                        }
                    }
                },
            }
        };
        scope.uiSchema = {
            'type': 'MasterDetailLayout',
            'scope': {
                '$ref': '#'
            },
        };
        scope.data = {
            'a': [
                    {'name': 'x_1'},
                    {'name': 'x_2'}
                ],
            'c': [
                    {'name': 'y_1'},
                    {'name': 'y_2'}
                ]
            };
        let el = $compile('<jsonforms schema="schema" uischema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain('<!-- Master -->'); // this is not resolved completly
        expect(el.html()).toContain('<!-- Detail -->'); // this is not resolved completly
        expect(el.html()).toContain('a');
        expect(el.html()).toContain('x_1');
        expect(el.html()).toContain('x_2');
        expect(el.html()).toContain('c');
        expect(el.html()).toContain('y_1');
        expect(el.html()).toContain('y_2');

        let nameInput_empty = el[0].querySelector('#\\#\\/properties\\/name');
        expect(nameInput_empty).toBeNull();

        let x1 = el[0].querySelector('span.jsf-masterdetail-entry');
        angular.element(x1).triggerHandler('click');
        expect(el.html()).toContain('<label');
        let nameInput = el[0].querySelector('#\\#\\/properties\\/name');
        expect(nameInput).not.toBeNull();

        expect(DataService.getRoot()).toBe(scope.data);
    }));
});

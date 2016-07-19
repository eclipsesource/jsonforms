import 'angular';
import 'angular-mocks';
import '../../../index';

import {UiSchemaRegistry, UiSchemaTester, NOT_FITTING} from './uischemaregistry-service';
import {UISchemaGenerator} from '../../generators/jsonforms-uischemagenerator';

describe('UiSchemaRegistry', () => {

    let uischemaRegistry: UiSchemaRegistry;

    beforeEach(angular.mock.module('jsonforms.form'));
    beforeEach(() => {
        inject(['UiSchemaRegistry', function(_UiSchemaRegistry_: UiSchemaRegistry) {
            uischemaRegistry = _UiSchemaRegistry_;
        }]);
    });


    it('should return generated uischema on start', function () {
        let dataSchema = {
            'type' : 'object',
            'properties': {
                'name': {
                    'type': 'string'
                }
            }
        };
        let expectedGeneratedUiSchema = new UISchemaGenerator().generateDefaultUISchema(dataSchema);
        expect(uischemaRegistry.getBestUiSchema(dataSchema, {})).toEqual(expectedGeneratedUiSchema);
    });

    it('should return registered fitting uischema', function () {
        let dataSchema = {
            'type' : 'object',
            'properties': {
                'name': {
                    'type': 'string'
                }
            }
        };
        let uiSchema = {
            'type': 'Control',
            'scope': {
                '$ref': '#/properties/name'
            }
        };
        let testFunction: UiSchemaTester = (schema: any) : number => {
            if (dataSchema === schema) {
                return 1;
            }
            return NOT_FITTING;
        };
        uischemaRegistry.register(uiSchema, testFunction);
        expect(uischemaRegistry.getBestUiSchema(dataSchema, {})).toBe(uiSchema);
    });

    it('should return genetared uischema if registered is not fitting', function () {
        let dataSchema = {
            'type' : 'object',
            'properties': {
                'name': {
                    'type': 'string'
                }
            }
        };
        let uiSchema = {
            'type': 'Control',
            'scope': {
                '$ref': '#/properties/name'
            }
        };
        let testFunction: UiSchemaTester = (schema: any) : number => {
            if (dataSchema === schema) {
                return NOT_FITTING;
            }
            return 1;
        };
        uischemaRegistry.register(uiSchema, testFunction);
        let expectedGeneratedUiSchema = new UISchemaGenerator().generateDefaultUISchema(dataSchema);
        expect(uischemaRegistry.getBestUiSchema(dataSchema, {})).toEqual(expectedGeneratedUiSchema);
    });

    it('should return higher tester registered uischema', function () {
        let dataSchema = {
            'type' : 'object',
            'properties': {
                'name': {
                    'type': 'string'
                }
            }
        };
        let uiSchema1 = {
            'type': 'Control',
            'scope': {
                '$ref': '#/properties/name'
            }
        };
        let uiSchema2 = {
            'type': 'Control',
            'scope': {
                '$ref': '#/properties/name'
            }
        };
        let testFunction1: UiSchemaTester = (schema: any) : number => {
            if (dataSchema === schema) {
                return 1;
            }
            return NOT_FITTING;
        };
        let testFunction2: UiSchemaTester = (schema: any) : number => {
            if (dataSchema === schema) {
                return 2;
            }
            return NOT_FITTING;
        };
        uischemaRegistry.register(uiSchema1, testFunction1);
        uischemaRegistry.register(uiSchema2, testFunction2);
        expect(uischemaRegistry.getBestUiSchema(dataSchema, {})).toBe(uiSchema2);
    });
});

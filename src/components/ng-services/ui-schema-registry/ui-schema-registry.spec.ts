import 'angular';
import 'angular-mocks';
import '../../../index';

import {UiSchemaRegistry, UiSchemaTester, NOT_FITTING} from './ui-schema-registry.service';
import {UISchemaGenerator} from '../../generators/ui-schema-gen.service';
import {SchemaElement} from "../../../jsonschema";

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


    it('should return registered fitting uischema and data', function () {
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
        let anotherUiSchema = {
            'type': 'Control',
            'label': 'My label',
            'scope': {
                '$ref': '#/properties/name'
            }
        };
        let testFunction: UiSchemaTester = (schema: SchemaElement, data: any) : number => {
            if (data.name === 'Foo') {
                return 1;
            }
            return NOT_FITTING;
        };
        let anotherTestFunction: UiSchemaTester = (schema: SchemaElement, data: any) : number => {
            if (data.name === 'Bar') {
                return 1;
            }
            return NOT_FITTING;
        };
        uischemaRegistry.register(uiSchema, testFunction);
        uischemaRegistry.register(anotherUiSchema, anotherTestFunction);
        expect(uischemaRegistry.getBestUiSchema(dataSchema, {'name': 'Foo'})).toBe(uiSchema);
        expect(uischemaRegistry.getBestUiSchema(dataSchema, {'name': 'Bar'})).toBe(anotherUiSchema);
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

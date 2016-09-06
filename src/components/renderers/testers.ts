
import {SchemaElement} from '../../jsonschema';
import {IUISchemaElement} from '../../uischema';
import {PathResolver} from '../services/path-resolver/path-resolver';
import {NOT_FITTING} from './renderer.service';

export function schemaTypeIs(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        let schemaPath =  uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        if (schemaPath === undefined) {
            return false;
        }
        let currentDataSchema: SchemaElement = PathResolver.resolveSchema(schema, schemaPath);
        if (currentDataSchema === undefined) {
            return false;
        }
        return currentDataSchema.type === expected;
    };
}

export function hasDataPropertyValue(propName: string, expected: any) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        return _.has(data, propName) && data[propName] === expected;
    };
}

export function uiTypeIs(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        return uiSchema.type === expected;
    };
}


export function optionIs(optionName: string, expected: any) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        let options = uiSchema['options'];
        if (options === undefined) {
            return false;
        }
        return options[optionName] === expected;
    };
}

export function schemaTypeMatches(check: (schema: SchemaElement) => boolean) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        let schemaPath =  uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        // TODO ugly
        let currentDataSchema: SchemaElement = PathResolver.resolveSchema(schema, schemaPath);
        return check(currentDataSchema);
    };
}


export function schemaPathEndsWith(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        return _.endsWith(uiSchema['scope']['$ref'], expected);
    };
}

export function schemaPropertyName(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        let schemaPath = uiSchema['scope']['$ref'];
        return _.last(schemaPath.split('/')) === expected;
    };
}

export function always(uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean {
    return true;
}




export class RendererTesterBuilder {

    and(...testers:
            Array<(uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean>)  {
        return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) =>
            testers.reduce((acc, tester) => acc && tester(uiSchema, schema, data), true);
    }

    create(test: (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean,
           spec: number): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => number {
        return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): number => {
            if (test(uiSchema, schema, data)) {
                return spec;
            }
            return NOT_FITTING;
        };
    }

}

export const Testers = new RendererTesterBuilder();

export default angular.module('jsonforms.testers', [])
    .service('JSONFormsTesters', () => {
        return {
            schemaPathEndsWith: schemaPathEndsWith,
            schemaPropertyName: schemaPropertyName,
            schemaTypeMatches:  schemaTypeMatches,
            uiTypeIs: uiTypeIs,
            schemaTypeIs: schemaTypeIs,
            optionIs: optionIs,
            and: Testers.and
        };
    }).name;

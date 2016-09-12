import {IUISchemaElement} from '../../../uischema';
import {IUISchemaGenerator} from '../../generators/generators';
import {SchemaElement} from '../../../jsonschema';

export interface UiSchemaRegistry {
    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(schema: SchemaElement, data: any): IUISchemaElement;
}
export interface UiSchemaTester {
    (schema: SchemaElement, data: any): number;
}
interface UiSchemaDefinition {
    uiSchema: IUISchemaElement;
    tester: UiSchemaTester;
}
export const NOT_FITTING: number = -1;
const NO_UISCHEMA_DEFINITION = {uiSchema: null, tester: (schema) => 0};
export class UiSchemaRegistryImpl implements UiSchemaRegistry {
    static $inject = ['UISchemaGenerator'];
    private registry: Array<UiSchemaDefinition> = [];
    constructor(private uiSchemaGenerator: IUISchemaGenerator) {
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }

    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void {
        this.registry.push({uiSchema: uiSchema, tester: tester});
    }
    getBestUiSchema(schema: SchemaElement, data: any): IUISchemaElement {
        let bestSchema = _.maxBy(this.registry, renderer =>
            renderer.tester(schema, data)
        );
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return this.uiSchemaGenerator.generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    }
}

export default angular
    .module('jsonforms.service.uischema-registry', [])
    .service('UiSchemaRegistry', UiSchemaRegistryImpl)
    .name;

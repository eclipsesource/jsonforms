import {IUISchemaElement} from '../../../jsonforms';
import {IUISchemaGenerator} from '../../generators/generators';

export interface UiSchemaRegistry {
    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(dataSchema: any): IUISchemaElement;
}
export interface UiSchemaTester {
    (dataSchema: any): number;
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
    getBestUiSchema(dataSchema: any): IUISchemaElement {
        let bestSchema = _.maxBy(this.registry, renderer =>
            renderer.tester(dataSchema)
        );
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return this.uiSchemaGenerator.generateDefaultUISchema(dataSchema);
        }
        return bestSchema.uiSchema;
    }
}

export default angular
    .module('jsonforms.uischemaregistry', [])
    .service('UiSchemaRegistry', UiSchemaRegistryImpl)
    .name;

import * as _ from 'lodash';
import {UISchemaElement} from '../models/uischema';
import {JsonSchema} from '../models/jsonSchema';
import {generateDefaultUISchema} from '../generators/ui-schema-gen';
export interface UiSchemaRegistry {
    register(uiSchema: UISchemaElement, tester: UiSchemaTester): void;
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement;
}
export interface UiSchemaTester {
    (schema: JsonSchema, data: any): number;
}
interface UiSchemaDefinition {
    uiSchema: UISchemaElement;
    tester: UiSchemaTester;
}
export const NOT_FITTING: number = -1;
const NO_UISCHEMA_DEFINITION = {uiSchema: null, tester: (schema) => 0};
export class UiSchemaRegistryImpl implements UiSchemaRegistry {
    private registry: Array<UiSchemaDefinition> = [];
    constructor() {
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }

    register(uiSchema: UISchemaElement, tester: UiSchemaTester): void {
        this.registry.push({uiSchema, tester});
    }
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void {
        this.registry = _.filter(this.registry, el =>
            // compare testers via strict equality
            el.tester !== tester || !_.eq(el.uiSchema, uiSchema)
        );
    }
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement {
        const bestSchema = _.maxBy(this.registry, renderer =>
            renderer.tester(schema, data)
        );
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    }
}

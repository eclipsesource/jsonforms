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
        this.registry.push({uiSchema: uiSchema, tester: tester});
    }
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void {
      const index = this.registry.indexOf({uiSchema: uiSchema, tester: tester});
      this.registry.splice(index, 1);
    }
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement {
        let bestSchema = this.maxBy(this.registry, renderer =>
            renderer.tester(schema, data)
        );
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    }

    private maxBy<T>(array: Array<T>, callback: (value: T) => number): T {
      let result = null;
      let maximum = null;
      array.forEach(element => {
        const currentValue = callback(element);
        if (maximum === null || currentValue > maximum) {
          maximum = currentValue;
          result = element;
        }
      });
      return result;
    }
}

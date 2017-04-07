import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import { DataService } from './data.service';
import { RUNTIME_TYPE, RuntimeListener } from './runtime';
export declare abstract class Renderer extends HTMLElement implements RuntimeListener {
    protected uischema: UISchemaElement;
    protected dataService: DataService;
    protected dataSchema: JsonSchema;
    setUiSchema(uischema: UISchemaElement): void;
    setDataService(dataService: DataService): void;
    setDataSchema(dataSchema: JsonSchema): void;
    notify(type: RUNTIME_TYPE): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    abstract render(): HTMLElement;
    abstract dispose(): void;
}

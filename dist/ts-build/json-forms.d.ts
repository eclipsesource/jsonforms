import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { DataChangeListener } from './core/data.service';
export declare class JsonForms extends HTMLElement {
    private dataService;
    private uischema;
    private dataschema;
    private dataObject;
    private schemaPromise;
    private allowDynamicUpdate;
    private services;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private render();
    data: Object;
    uiSchema: UISchemaElement;
    dataSchema: JsonSchema;
    private createServices(uiSchema, dataSchema);
    addDataChangeListener(listener: DataChangeListener): void;
}

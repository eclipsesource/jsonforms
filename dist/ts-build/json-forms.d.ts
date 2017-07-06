import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { DataChangeListener } from './core/data.service';
/**
 * HTML element that represents the entry point
 */
export declare class JsonFormsElement extends HTMLElement {
    private dataService;
    private uischema;
    private dataschema;
    private dataObject;
    private schemaPromise;
    private allowDynamicUpdate;
    private services;
    /**
     * Constructor.
     */
    constructor();
    /**
     * Called when this element is inserted into a document.
     */
    connectedCallback(): void;
    /**
     * Called when this element is removed from a document.
     */
    disconnectedCallback: () => void;
    /**
     * Set the data to be rendered.
     * @param {Object} data the data to be rendered
     */
    data: Object;
    /**
     * Returns the UI schema to be rendered.
     *
     * @returns {UISchemaElement} the UI schema to be rendered
     */
    /**
     * Set the UI schema.
     * @param {UISchemaElement} uischema the UI schema element to be set
     */
    uiSchema: UISchemaElement;
    /**
     * Returns the JSON schema that describes the data to be rendered.
     *
     * @returns {JsonSchema} the JSON schema that describes the data to be rendered
     */
    /**
     * Set the JSON data schema that describes the data to be rendered.
     * @param {JsonSchema} dataSchema the data schema to be rendered
     */
    dataSchema: JsonSchema;
    /**
     * Add a data change listener.
     *
     * @param {DataChangeListener} listener the listener to be added
     */
    addDataChangeListener: (listener: DataChangeListener) => void;
    private render();
    private createServices(uiSchema, dataSchema);
    private instantiateSchemaIfNeeded(schema);
}

import './renderers';
import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { Store } from 'redux';
export interface JsonFormsStore extends Store<any> {
}
/**
 * HTML element that represents the entry point
 */
export declare class JsonFormsElement extends HTMLElement {
    private dataObject;
    private uischema;
    private dataschema;
    schemaPromise: Promise<any>;
    private allowDynamicUpdate;
    store: Store<any>;
    /**
     * Constructor.
     */
    constructor();
    /**
     * Called when this element is inserted into a document.
     */
    connectedCallback(): void;
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
    private render();
    private instantiateSchemaIfNeeded(schema);
}

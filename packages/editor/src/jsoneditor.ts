import '@jsonforms/material-renderers';
import {
  initJsonFormsStore,
  JsonForms,
  // JsonFormsElement,
  JsonFormsStore,
  JsonSchema,
  // MasterDetailLayout,
  UISchemaElement
} from '@jsonforms/core';
import { ModelMapping } from './editor-config';
import { Editor } from './editor';
import * as _ from 'lodash';
import { EditorConfiguration } from './editor-config';
import { Resources } from './resources/resources';
import * as JsonRefs from 'json-refs';
import { EditorContext } from './editor-context';
import { SchemaServiceImpl } from './services/schema.service.impl';
// import { store } from './store';
import { getData } from '@jsonforms/core';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MasterDetail } from './MasterDetail';

export * from './toolbar';
export * from './editor';
export * from './editor-config';

/**
 * The JsonEditor renders JSON data specified by a JSON Schema.
 * It displays the data's containment hierarchy in a tree and allows to
 * edit the data objects' properties.
 * Thereby, the visual representation of the editor can be customized by providing
 * mappings that map types defined in the schema to images, define the types'
 * naming property, and defining a mapping between an object's property and its type.
 */
export class JsonEditor extends HTMLElement implements Editor {
  public static rootData;
  static uiSchemata: {[schemaId: string]: UISchemaElement} = {};

  static getUiSchema(schemaId: string): UISchemaElement {
    return JsonEditor.uiSchemata[schemaId];

  }

  store: JsonFormsStore;
  private connected = false;
  private _editorContext: EditorContext;
  private schemaPromise;
  // private treeRenderer: TreeMasterDetailRenderer;
  private container: HTMLElement;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.connected = true;
    this.render();
  }
  diconnectedCallback(): void {
    this.connected = false;
  }

  get editorContext(): EditorContext {
    if (this._editorContext === undefined || this._editorContext === null) {
      this._editorContext = new EditorContext();
    }

    return this._editorContext;
  }

  /**
   * Returns the current data displayed in the editor.
   */
  get data() {
    // return this.editorContext.data;
    if (this.store === undefined || this.store === null) {
      return {};
    }

    return getData(this.store.getState());
  }
  /**
   * Sets the data edited in the editor
   */
  set data(data: object) {
    this.editorContext.data = data;
    JsonEditor.rootData = data;
    this.render();
  }

  /**
   * Set the JsonSchema defining the editor's data.
   */
  set schema(schema: JsonSchema) {
    this.editorContext.dataSchema = null;
    // resolve the references in the schema
    this.schemaPromise = JsonRefs.resolveRefs(schema, { includeInvalid: true });
    this.schemaPromise.then(result => {
      this.editorContext.dataSchema = result.resolved;
      this.schemaPromise = null;
      this.render();
    });
  }
  /**
   * Get the JsonSchema defining the editor's data.
   */
  get schema() {
    return this.editorContext.dataSchema;
  }

  /**
   * Set the identifying property used for id-based referencing.
   */
  set identifyingProperty(identifyingProperty: string) {
    this.editorContext.identifyingProperty = identifyingProperty;
  }

  /**
   * Get the identifying property used for id-based referencing.
   */
  get identifyingProperty(): string {
    return this.editorContext.identifyingProperty;
  }

  /**
   * Allows to configure the editor with a single EditorConfiguration object.
   */
  configure(config: EditorConfiguration) {
    if (!_.isEmpty(config.imageMapping)) {
      this.setImageMapping(config.imageMapping);
    }
    if (!_.isEmpty(config.labelMapping)) {
      this.setLabelMapping(config.labelMapping);
    }
    if (!_.isEmpty(config.modelMapping)) {
      this.setModelMapping(config.modelMapping);
    }
    if (!_.isEmpty(config.identifyingProperty)) {
      this.identifyingProperty = config.identifyingProperty;
    }
    // register all UI Schemata
    if (!_.isEmpty(config.detailSchemata)) {
      Object.keys(config.detailSchemata).forEach(key => {
        try {
          const uiSchema = config.detailSchemata[key] as UISchemaElement;
          this.registerDetailSchema(key, uiSchema);
        } catch (e) {
          console.warn(`Data registered for id '${key}' is not a valid UI Schema:`,
                       config.detailSchemata[key]);
        }
      });
    }
    if (!_.isEmpty(config.resources)) {
      Object.keys(config.resources).forEach(name => {
        this.registerResource(name, config.resources[name]);
      });
    }
    this.schema = config.dataSchema;
    if (!_.isEmpty(config.data)) {
      this.editorContext.data = config.data;
    } else {
      this.editorContext.data = {};
    }
  }

  /**
   * Configures the label mappings for the types defined in the editor's schema.
   * A label mapping maps from a schema id to a property defined in this schema.
   * This property defines the name of a rendered object in the containment tree.
   */
  setLabelMapping(labelMapping): void {
    this.editorContext.labelProvider = labelMapping;
  }

  /**
   * Configures the image mappings for the types defined in the editor's schema.
   * An image mapping maps from a schema id to the schema's image name.
   * This name is used to resolve the css style that configure a label
   * for instances of the type in the containment tree.
   */
  setImageMapping(imageMapping): void {
    this.editorContext.imageProvider = imageMapping;
  }

  /**
   * The model mapping defines mappings from a property value to a type.
   * Thereby, the model mapping defines which property is considered.
   * This property is the same for all types.
   * A mapping maps from a specific value of this property to a schema id.
   * If an element contains a mapped value in the defined property,
   * it is assumed to be of the type defined by the mapped schema id.
   *
   * A model mapping is necessary for all types used in anyOf sections of a schema
   * in order to determine which type objects of a "anyOf-property" belong to.
   */
  setModelMapping(modelMapping: ModelMapping): void {
    JsonForms.modelMapping = modelMapping;
    this.editorContext.modelMapping = modelMapping;
  }

  /**
   * Register a resource for the given name.
   * The resource can be used as reference target or to specify a reference target schema.
   *
   * @param name The name of the resource to register
   * @param resource The resource data
   * @param resolve Whether JSON References and Pointers in the resource should be resolved
   */
  registerResource(name: string, resource: Object, resolve = true) {
    // Register resource and resolve JSON References/Pointers
    Resources.resourceSet.registerResource(name, resource, resolve);
  }

  /**
   * Registers a UI Schema for objects defined by the schema specified by the given schema id.
   * A registered UI Schema is used when rendering a suitable object
   * that was selected in the containment tree.
   * The UI Schema specifies rendered controls, layouts, and additional rendering information.
   * Thereby, the UI Schema is the same as the UI Schemata used in JsonForms 2.
   *
   * @param {string} schemaId The id of the type's JsonSchema that the UI Schema is registered for
   * @param {UISchemaElement} uiSchema The UI Schema to use when rendering instances of the schema
   */
  registerDetailSchema(schemaId: string, uiSchema: UISchemaElement) {
    JsonForms.uischemaRegistry.register(uiSchema, (schema, _data) =>
      schema.id !== undefined && schema.id === schemaId ? 2 : -1);
    JsonEditor.uiSchemata[schemaId] = uiSchema;
  }

  private render(): void {
    if (!this.connected || this.editorContext.data === undefined || this.editorContext.data === null
      || _.isEmpty(this.editorContext.dataSchema)) {
      return;
    }
    if (this.schemaPromise !== null) {
      return;
    }

    if (this.container === undefined) {
      this.container = document.createElement('div');
      this.container.id = 'json-editor-tree-container';
      this.appendChild(this.container);
    }

    const uischema = {
      'type': 'MasterDetailLayout',
      'scope': {
        '$ref': '#'
      },
      'options': {
        'labelProvider': this.editorContext.labelProvider,
        'imageProvider': this.editorContext.imageProvider,
        'modelMapping': this.editorContext.modelMapping
      }
    };

    if (this.store === undefined) {
      this.store = initJsonFormsStore(this.data, this.schema, uischema);
    }
    const schemaService = new SchemaServiceImpl(this.editorContext);

    ReactDOM.unmountComponentAtNode(this.container);

    const masterDetailComponent = React.createElement(MasterDetail, {
      store: this.store,
      schema: this.schema,
      uischema: uischema,
      schemaService: schemaService
    });

    ReactDOM.render(masterDetailComponent, this.container);
  }
}

if (!customElements.get('json-editor')) {
  customElements.define('json-editor', JsonEditor);
}

import { JsonSchema, UISchemaElement } from '@jsonforms/core';

/**
 * Contains all information needed to instantiate a customized JsonEditor.
 */
export interface EditorConfiguration {
  /**
   * The schema defining the data editable in the editor.
   * allOf, not, and oneOf constructs are not supported.
   */
  dataSchema: JsonSchema;

  /**
   * The data to initialize the editor with.
   * If this is not set, the editor is initialized with the empty object {}.
   */
  data?: Object;

  /**
   * Object containing all UI Schemata for the JsonEditor.
   * The name of the property containing the UI schema is its schema id.
   * The property value is the UISchemaElement itself.
   *
   * A UI Schema is used when rendering a suitable object that was selected in the containment tree.
   * The UI Schema specifies rendered controls, layouts, and additional rendering information.
   * Thereby, the UI Schema is the same as the UI Schemata used in JsonForms 2.
   */
  detailSchemata?: {[schemaId: string]: UISchemaElement};

  /**
   * Configures the image mappings for the types defined in the editor's schema.
   * An image mapping maps from a schema id to the schema's image name.
   * This name is used to resolve the css style that configure a label
   * for instances of the type in the containment tree.
   * Both the id and the name are configured as Strings.
   */
  imageMapping?: StringMap;

  /**
   * Configures the label mappings for the types defined in the editor's schema.
   * A label mapping maps from a schema id to a property defined in this schema.
   * This property defines the name of a rendered object in the containment tree.
   * Both the id and the property name are configured as Strings.
   */
  labelMapping?: StringMap;

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
  modelMapping?: ModelMapping;

  /**
   * Property names define the name of the resource.
   * This name is used in reference configurations to define
   * which data is searched for reference targets.
   * The content is the actual data.
   * e.g.
   * {
   *   'data1': { "name": "Robert", "age": 25 },
   *   'data2': { "name": "Bello", "species": "dog", "sex": "male"}
   * }
   */
  resources?: { [property: string]: Object };

  /**
   * The identifying property is the name of the property that contains
   * a data element's unique ID when id-based referencing is used.
   */
  identifyingProperty?: string;
}

export interface StringMap {
  [property: string]: string;
}

export interface ModelMapping {
  attribute: string;
  mapping: StringMap;
}

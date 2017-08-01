import * as _ from 'lodash';
import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaRegistry, UISchemaRegistryImpl } from './core/uischema.registry';
import { DataService } from './core/data.service';
import { RendererService } from './core/renderer.service';
import { StylingRegistry, StylingRegistryImpl } from './core/styling.registry';
import { SchemaService } from './core/schema.service';
import { SchemaServiceImpl } from './core/schema.service.impl';

/**
 * Represents a JSONForms service.
 */
export interface JsonFormService {

  /**
   * Disposes this service.
   */
  dispose(): void;
}

/**
 * Encapsulates instantiation logic of a JSONForms service.
 */
export interface JsonFormsServiceConstructable {
  /**
   * Constructor logic.
   *
   * @param {DataService} dataService the data service
   * @param {JsonSchema} dataSchema the JSON schema describing the data
   * @param {UISchemaElement} uiSchema the UI schema to be rendered
   */
  new(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}

/**
 * Global JSONForms object that holds services and registries.
 */
export class JsonForms {
  private static _schemaService;
  public static rendererService = new RendererService();
  public static jsonFormsServices: JsonFormsServiceConstructable[] = [];
  public static uischemaRegistry: UISchemaRegistry = new UISchemaRegistryImpl();
  public static stylingRegistry: StylingRegistry = new StylingRegistryImpl();
  public static modelMapping;
  public static set schema(schema: JsonSchema) {
    JsonForms._schemaService = new SchemaServiceImpl(schema);
  }
  public static get schemaService(): SchemaService  {
    if (this._schemaService === undefined) {
      console.error("Schema service has not been initialized");
    }
    return this._schemaService;
  }

  /**
   * Uses the model mapping to filter all objects that are associated with the type
   * defined by the given schema id. If there is no applicable mapping,
   * we assume that no mapping is necessary and do not filter out affected data objects.
   *
   * @param objects the list of data objects to filter
   * @param schemaId The id of the JsonSchema defining the type to filter for
   * @return The filtered data objects or all objects if there is no applicable mapping
   */
  static filterObjectsByType = (objects: Object[], schemaId: string): Object[] => {
    return objects.filter(value => {
      const valueSchemaId = JsonForms.getSchemaIdForObject(value);
      if (valueSchemaId === null) {
        return true;
      }

      return valueSchemaId === schemaId;
    });
  }

  /**
   * Uses the model mapping to find the schema id defining the type of the given object.
   * If no schema id can be determined either because the object is empty, there is no model
   * mapping, or the object does not contain a mappable property.
   * TODO expected behavior?
   *
   * @param object The object whose type is determined
   * @return The schema id of the object or null if it could not be determined
   */
  static getSchemaIdForObject = (object: Object): string => {
    if (JsonForms.modelMapping !== undefined && !_.isEmpty(object)) {
      const mappingAttribute = JsonForms.modelMapping.attribute;
      if (!_.isEmpty(mappingAttribute)) {
        const mappingValue = object[mappingAttribute];
        const schemaElementId: string = JsonForms.modelMapping.mapping[mappingValue];

        return !_.isEmpty(schemaElementId) ? schemaElementId : null;
      }
    }

    return null;
  }
}

/**
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
// Disable rule because it is used as an decorator
// tslint:disable:variable-name
export const JsonFormsServiceElement = config => (cls: JsonFormsServiceConstructable) => {
  JsonForms.jsonFormsServices.push(cls);
};
// tslint:enable:variable-name

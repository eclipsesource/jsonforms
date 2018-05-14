import * as _ from 'lodash';
import { JsonSchema } from '@jsonforms/core';
import { resolveSchema } from '@jsonforms/core';
import * as JsonRefs from 'json-refs';

const isObject = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema): boolean => {
  return schema.items !== undefined;
};
const deepCopy = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object)) as T;
};

/**
 * A Property wraps a JsonSchema and provides additional information
 * like a label and the property key.
 */
export interface Property {
  /**
   * The label is a text donating a human readable name of the schema the property describes.
   */
  label: string;
  /**
   * The property is a text donating the schema key from which this property was created.
   */
  property: string;
  /**
   * The schema is the JsonSchema this property describes.
   */
  schema: JsonSchema;
}

/**
 * Interface for describing result of an extracted schema ref
 */
interface SchemaRef {
  uri: string;
}

/**
 * Interface wraps SchemaRef
 */
interface SchemaRefs {
  [id: string]: SchemaRef;
}

/**
 * Returns the label of a container
 * @param {Property} containerProperty
 * @returns {string}
 */
export const getPropertyLabel =  (containerProperty: Property): string => {
  return _.find(
    [
      containerProperty.schema.title,
      containerProperty.label,
      containerProperty.schema.id,
      containerProperty.property
    ],
    n => !_.isEmpty(n)
  );
};

/**
 * Finding required definitions from parentSchema by using schema refs
 *
 * @param parentSchema The root schema
 * @param allRefs All the refs of root schema
 * @param schemaRefs The current schema refs
 * @param extractedReferences Contains the definition attributes for the current schema
 * @returns SchemaRefs all the required reference paths for subschema
 */
const findReferencePaths = (parentSchema: JsonSchema,
                            allRefs: SchemaRefs,
                            schemaRefs: SchemaRefs,
                            extractedReferences: { [id: string]: string }
): SchemaRefs => {
  return _.reduce(
    schemaRefs, (prev, schemaRefValue)  => {
      let refs = _.pickBy(prev, _.flip(key => _.startsWith(key, schemaRefValue.uri)));
      if (extractedReferences[schemaRefValue.uri]) {
        refs = undefined;
      }
      if (!extractedReferences[schemaRefValue.uri]) {
        extractedReferences[schemaRefValue.uri] = schemaRefValue.uri;
        prev = _.omitBy(prev, value => value.uri === schemaRefValue.uri);
      }
      if (refs !== undefined) {
        findReferencePaths(parentSchema, prev, refs, extractedReferences);
      }
      return prev;
    },
    allRefs
  );
};

/**
 * Calculate references that are used in parentSchema and add copy them into schema
 *
 * @param parentSchema root schema which is used to find all the schema refs
 * @param schema current subschema without resolved references
 * @returns JsonSchema current subschema with resolved references
 */
export const calculateSchemaReferences = (parentSchema: JsonSchema,
                                          schema: JsonSchema): JsonSchema => {
  const schemaRefs = JsonRefs.findRefs(schema, {resolveCirculars: true});
  const allRefs = JsonRefs.findRefs(parentSchema, {resolveCirculars: true});
  const extractedReferences = {};
  findReferencePaths(parentSchema, allRefs, schemaRefs, extractedReferences);
  const refList = _.values(extractedReferences) as string[];
  if (!_.isEmpty(refList)) {
    _.each(refList, ref => {
      const propertyRoot = ref.substring((ref.indexOf('/') + 1), (ref.lastIndexOf('/')));
      const property = ref.substring((ref.lastIndexOf('/') + 1));
      if (parentSchema[propertyRoot] && parentSchema[propertyRoot][property]) {
        if (schema[propertyRoot]) {
          schema[propertyRoot] = {
            ...schema[propertyRoot], ...{
              [property]: parentSchema[propertyRoot][property]
            }
          };
        } else {
          schema = {
            ...schema, ...{
              [propertyRoot]: { [property]: parentSchema[propertyRoot][property] }
            }
          };
        }
      }
    });
  }

  return schema;
};

/**
 * Retieves a self contained schema.
 * @param parentSchema The schema to use for resolvement
 * @param refPath The path to resolve
 * @return a JsonSchema that is self-contained
 */
export const getSelfContainedSchema = (parentSchema: JsonSchema, refPath: string): JsonSchema => {
  let schema = resolveSchema(parentSchema, refPath);
  schema = deepCopy(schema);
  if (_.isEmpty(schema.id)) {
    schema.id = '#' + refPath;
  }
  schema = { ...schema, ...calculateSchemaReferences(parentSchema, schema) };

  return schema;
};

/**
 * Calculates label for an item which is resolved in anyOf
 * @param {string} id The schema id
 * @returns {string}
 */
const calculateLabel = (id: string): string => (
  _.startsWith(id, '#') ? id.substring(id.lastIndexOf('#') + 1) : id
);

/**
 * Constructing container properties of a given schema
 * @param {string} property The schema key from which this property was created.
 * @param {string} label The name of the schema the property describes.
 * @param {JsonSchema} schema The schema is the JsonSchema this property describes.
 * @param {JsonSchema} rootSchema The parent schema
 * @param {boolean} isInContainment To indicate whether the schema is in a container or not
 * @param {boolean} internal To accept only directly contained containers
 * @returns {Property[]}
 */
export const getContainerProperty = (property: string,
                                     label: string,
                                     schema: JsonSchema,
                                     rootSchema: JsonSchema,
                                     isInContainment: boolean,
                                     internal = false): Property[] => {
  if (schema.$ref !== undefined) {
    return getContainerProperty(
      property,
      schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
      getSelfContainedSchema(rootSchema, schema.$ref),
      rootSchema,
      isInContainment,
      internal
    );
  }
  if (isObject(schema)) {
    if (isInContainment) {
      const prop: Property =  {
        property,
        label,
        schema
      };
      return [prop];
    }
    if (internal) {
      // If internal is true the schema service does not need to resolve further,
      // because only directly contained containments are wanted.
      // This prevents running into circles
      return [];
    }

    return Object.keys(schema.properties)
      .reduce(
        (prev, cur) =>
          prev.concat(
            getContainerProperty(
              cur,
              cur,
              schema.properties[cur],
              rootSchema,
              false,
              true
            )
          ),
        []
      );
  }
  if (isArray(schema) && !Array.isArray(schema.items)) {
    return getContainerProperty(
      property,
      label,
      schema.items,
      rootSchema,
      true,
      internal
    );
  }
  if (schema.anyOf !== undefined) {
    return schema.anyOf
      .reduce(
        (prev, cur) =>
          prev.concat(
            getContainerProperty(
              property,
              cur.id !== undefined ? calculateLabel(cur.id) : undefined,
              cur,
              rootSchema,
              isInContainment,
              internal
            )
          ),
        []
      );
  }

  return [];
};

/**
 * Retrieves an array of container properties based on the provided schema.
 * @param schema The schema to check for container properties
 * @return The array of {@link Property} or empty if no container properties are available
 * @see Property
 */
export const getContainerProperties = (schema: JsonSchema,
                                       rootSchema: JsonSchema): Property[] => {
  return getContainerProperty('root',
                              'root',
                              schema,
                              rootSchema,
                              false);
};

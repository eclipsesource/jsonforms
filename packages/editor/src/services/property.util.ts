import * as _ from 'lodash';
import { JsonSchema7 } from '@jsonforms/core';
import { resolveSchema } from '@jsonforms/core';
import * as JsonRefs from 'json-refs';

const isObject = (schema: JsonSchema7): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema7): boolean => {
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
  schema: JsonSchema7;
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
 * Returns the label of a property based on the best-effort solution
 * @param property The property contains a schema, label and a property as key
 * @returns {string}
 */
export const findPropertyLabel = (property: Property): string => {
  return _.find(
    [
      property.schema.title,
      property.label,
      property.schema.$id,
      property.property
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
const findReferences = (parentSchema: JsonSchema7,
                        allRefs: SchemaRefs,
                        schemaRefs: SchemaRefs,
                        extractedReferences: { [id: string]: string }
) =>
  _.reduce(
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
        findReferences(parentSchema, prev, refs, extractedReferences);
      }
      return prev;
    },
    allRefs
  );

/**
 * Calculate references for a given schema and copy definitions into the schema
 *
 * @param parentSchema root schema which is used to find all the schema refs
 * @param schema current subschema without resolved references
 * @returns JsonSchema current subschema with resolved references
 */
export const makeSchemaSelfContained = (parentSchema: JsonSchema7,
                                        schema: JsonSchema7): JsonSchema7 => {
  const schemaRefs = JsonRefs.findRefs(schema, {resolveCirculars: true});
  const allRefs = JsonRefs.findRefs(parentSchema, {resolveCirculars: true});
  let extractedReferences;
  findReferences(parentSchema, allRefs, schemaRefs, extractedReferences = {});
  const refList = _.values(extractedReferences) as string[];
  if (!_.isEmpty(refList)) {
    _.each(refList, ref => {
      const propertyKey = ref.substring((ref.indexOf('/') + 1), (ref.lastIndexOf('/')));
      const property = ref.substring((ref.lastIndexOf('/') + 1));
      if (_.has(parentSchema, propertyKey) && _.has(parentSchema, `${propertyKey}.${property}`)) {
        if (schema[propertyKey]) {
          schema[propertyKey] = {
            ...schema[propertyKey], ...{
              [property]: parentSchema[propertyKey][property]
            }
          };
        } else {
          schema = {
            ...schema, ...{
              [propertyKey]: { [property]: parentSchema[propertyKey][property] }
            }
          };
        }
      }
    });
  }

  return schema;
};

/**
 * Create a self contained schema.
 * @param parentSchema The schema to use for resolving
 * @param refPath The path to resolve
 * @return a JsonSchema that is self-contained
 */
export const makeSelfContainedSchema = (parentSchema: JsonSchema7, refPath: string): JsonSchema7 => {
  let schema: JsonSchema7 = resolveSchema(parentSchema, refPath) as JsonSchema7;
  schema = deepCopy(schema);
  if (_.isEmpty(schema.$id)) {
    schema.$id = '#' + refPath;
  }
  schema = { ...schema, ...makeSchemaSelfContained(parentSchema, schema) };

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
 * Returns a flattened list of container properties.
 * A property is being considered a container property if it is an array of objects,
 * meaning that all its children are non-primitive.
 *
 * @param {string} property The schema key from which this property was created.
 * @param {string} label The name of the schema the property describes.
 * @param {JsonSchema} schema The schema is the JsonSchema this property describes.
 * @param {JsonSchema} rootSchema The parent schema
 * @param {boolean} isInContainer To indicate whether the schema is in a container or not
 *                                Properties that are described in array are considered as
 *                                they are in a container.
 * @param {boolean} hasOnlyOwnChildren To accept only corresponding children of a property
 * @returns {@link Property[]} An array of properties where each property describes
 *                             a self-contained schema for the corresponding schema
 */
export const findContainerProperties = (property: string,
                                        label: string,
                                        schema: JsonSchema7,
                                        rootSchema: JsonSchema7,
                                        isInContainer: boolean,
                                        hasOnlyOwnChildren = false): Property[] => {
  if (schema.$ref !== undefined) {
    return findContainerProperties(
      property,
      schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
      makeSelfContainedSchema(rootSchema, schema.$ref),
      rootSchema,
      isInContainer,
      hasOnlyOwnChildren
    );
  }
  if (isObject(schema)) {
    if (isInContainer) {
      const prop: Property =  {
        property,
        label,
        schema
      };
      return [prop];
    }
    if (hasOnlyOwnChildren) {
      // All children of the property are known at this point
      // Don't need to resolve schema further
      return [];
    }

    return Object.keys(schema.properties)
      .reduce(
        (prev, currentProp) =>
          prev.concat(
            findContainerProperties(
              currentProp,
              currentProp,
              schema.properties[currentProp],
              rootSchema,
              false,
              true
            )
          ),
        []
      );
  }
  if (isArray(schema) && !Array.isArray(schema.items)) {
    return findContainerProperties(
      property,
      label,
      schema.items,
      rootSchema,
      true,
      hasOnlyOwnChildren
    );
  }
  if (schema.anyOf !== undefined) {
    return schema.anyOf
      .reduce(
        (prev, currentProp) =>
          prev.concat(
            findContainerProperties(
              property,
              currentProp.$id !== undefined ? calculateLabel(currentProp.$id) : undefined,
              currentProp,
              rootSchema,
              isInContainer,
              hasOnlyOwnChildren
            )
          ),
        []
      );
  }

  return [];
};

/**
 * Retrieves an array of properties based on the provided schema.
 *
 * @param schema The schema to check for properties
 * @return The array of {@link Property} or empty if no properties are available
 * @see Property
 */
export const retrieveContainerProperties = (schema: JsonSchema7, rootSchema: JsonSchema7) => {
  return findContainerProperties('root', 'root', schema, rootSchema, false);
};

/**
 * Returns a flattened map of sub schema ID to container properties.
 * A property is being considered a container property if it is an array of objects,
 * meaning that all its children are non-primitive
 *
 * @param schema The root schema
 * @param containerProperties All the available containers in the given schema
 *
 * @returns {{[p: string]: Property[]}}
 */
export const findAllContainerProperties =
  (schema: JsonSchema7,
   rootSchema: JsonSchema7,
   containerProperties: { [schemaId: string]: Property[] } = {}):
    { [schemaId: string]: Property[] } => {

    if (!_.has(containerProperties, schema.$id)) {
      const props = retrieveContainerProperties(schema, rootSchema);
      if (props.length !== 0) {
        containerProperties = {
          ...containerProperties,
          ...{[schema.$id]: props}
        };
        return _.reduce(
          props, (prev, curProp) => {
            return findAllContainerProperties(curProp.schema, rootSchema, prev);
          },
          containerProperties
        );
      }
    }

    return containerProperties;
};

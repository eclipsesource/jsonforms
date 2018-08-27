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
 * Returns the label of a property based on the best-effort solution
 * @param property The property contains a schema, label and a property as key
 * @returns {string}
 */
export const findPropertyLabel = (property: Property): string => {
  return _.find(
    [
      property.schema.title,
      property.label,
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
const findReferences = (parentSchema: JsonSchema,
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
export const makeSchemaSelfContained = (
  parentSchema: JsonSchema,
  schema: JsonSchema
): JsonSchema => {
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
const resolveAndMakeSchemaSelfContained =
  (parentSchema: JsonSchema, refPath: string): JsonSchema => {
  const schema: JsonSchema = resolveSchema(parentSchema, refPath) as JsonSchema;
  return { ...schema, ...makeSchemaSelfContained(parentSchema, schema) } as JsonSchema;
};

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
 *                                being in a container.
 * @returns {@link Property[]} An array of properties where each property describes
 *                             a self-contained schema for the corresponding schema
 */
const findContainerProps = (property: string,
                            label: string,
                            schema: JsonSchema,
                            rootSchema: JsonSchema,
                            isInContainer: boolean,
                            visited: Map<string, string>,
                            recurse: boolean): Property[] => {

  if (schema.$ref !== undefined) {
    if (visited.has(label)) {
      return [];
    }
    return findContainerProps(
      property,
      schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
      resolveAndMakeSchemaSelfContained(rootSchema, schema.$ref),
      rootSchema,
      isInContainer,
      visited.set(label, schema.$ref),
      recurse
    );
  } else if (isObject(schema)) {
    const props = [];

    if (isInContainer) {
      const prop: Property =  {
        property,
        label,
        schema
      };
      props.push(prop);

      if (!recurse) {
        return props;
      }
    }

    return Object.keys(schema.properties)
      .reduce(
        (prev, currentProp) =>
          prev.concat(
            findContainerProps(
              currentProp,
              currentProp,
              schema.properties[currentProp],
              rootSchema,
              false,
              visited,
              recurse
            )
          ),
        props
      );
  } else if (isArray(schema) && !Array.isArray(schema.items)) {

    return findContainerProps(
      property,
      label,
      schema.items,
      rootSchema,
      true,
      visited,
      recurse
    );
  } else if (schema.anyOf !== undefined) {
    // TODO: oneOf?
    const init: Property[] = [];
    return _.reduce(
      schema.anyOf,
      (prev: Property[], anyOfSubSchema: JsonSchema, index: number) =>
        prev.concat(
          findContainerProps(
            property,
            `${property}.anyOf.${index}`,
            anyOfSubSchema,
            rootSchema,
            isInContainer,
            visited,
            recurse
          )
        ),
      init
    );
  }

  return [];
};

/**
 * Retrieves an array of properties based on the provided schema.
 *
 * @param schema the schema to check for container properties
 * @param rootSchema the root schema
 * @param recurse whether to recurse in case properties have already been found.
 *        Set to true for finding all valid, i.e. nested container properties
 * @return The array of {@link Property} or empty if no properties are available
 * @see Property
 */
export const findContainerProperties =
  (schema: JsonSchema, rootSchema: JsonSchema, recurse: boolean): Property[] =>
    findContainerProps('root', 'root', schema, rootSchema, false, new Map(), recurse);

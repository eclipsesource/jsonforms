/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import set from 'lodash/set';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import pickBy from 'lodash/pickBy';
import omitBy from 'lodash/omitBy';
import startsWith from 'lodash/startsWith';
import values from 'lodash/values';
import each from 'lodash/each';
import {
  findRefs,
  JsonSchema,
  JsonSchema7,
  resolveSchema,
  SchemaRefs
} from '@jsonforms/core';

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
  label: string;

  property: string;

  schemaPath?: string;

  /**
   * The schema is the JsonSchema this property describes.
   */
  schema: JsonSchema7;
}

/**
 * Returns the label of a property based on the best-effort solution
 * @param property The property contains a schema, label and a property as key
 * @returns {string}
 */
export const findPropertyLabel = (property: Property): string => {
  return find(
    [property.schema.title, property.label, property.property],
    n => !isEmpty(n)
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
const findReferences = (
  parentSchema: JsonSchema,
  allRefs: SchemaRefs,
  schemaRefs: SchemaRefs,
  extractedReferences: { [id: string]: string }
) =>
  reduce(
    schemaRefs,
    (prev, schemaRefValue) => {
      let refs = pickBy(prev, (_value, key) =>
        startsWith(key, schemaRefValue.uri)
      );
      if (extractedReferences[schemaRefValue.uri]) {
        refs = undefined;
      }
      if (!extractedReferences[schemaRefValue.uri]) {
        extractedReferences[schemaRefValue.uri] = schemaRefValue.uri;
        prev = omitBy(prev, value => value.uri === schemaRefValue.uri);
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
  parentSchema: JsonSchema7,
  schema: JsonSchema7
): JsonSchema7 => {
  const schemaRefs = findRefs(schema);
  const allRefs = findRefs(parentSchema);
  let extractedReferences;
  findReferences(parentSchema, allRefs, schemaRefs, (extractedReferences = {}));
  const refList = values(extractedReferences) as string[];
  if (!isEmpty(refList)) {
    each(refList, ref => {
      const propertyKey = ref.substring(
        ref.indexOf('/') + 1,
        ref.lastIndexOf('/')
      );
      const property = ref.substring(ref.lastIndexOf('/') + 1);
      if (
        (parentSchema as { [key: string]: any })[propertyKey] !== undefined &&
        (parentSchema as { [key: string]: any })[propertyKey][property] !==
          undefined
      ) {
        if (get(schema, propertyKey)) {
          set(schema, propertyKey, {
            ...get(schema, propertyKey),
            ...{
              [property]: get(parentSchema, [propertyKey, property])
            }
          });
        } else {
          schema = {
            ...schema,
            ...{
              [propertyKey]: {
                [property]: get(parentSchema, [propertyKey, property])
              }
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
const resolveAndMakeSchemaSelfContained = (
  parentSchema: JsonSchema7,
  refPath: string
): JsonSchema7 => {
  const schema: JsonSchema7 = resolveSchema(
    parentSchema,
    refPath
  ) as JsonSchema7;
  return {
    ...schema,
    ...makeSchemaSelfContained(parentSchema, schema)
  };
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
const findContainerProps = (
  property: string,
  label: string,
  schemaPath: string,
  schema: JsonSchema7,
  rootSchema: JsonSchema7,
  isInContainer: boolean,
  visited: string[],
  recurse: boolean
): Property[] => {
  if (schema.$ref !== undefined) {
    if (visited.indexOf(schema.$ref) !== -1) {
      return [];
    }
    return findContainerProps(
      property,
      schema.$ref === '#'
        ? undefined
        : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
      schemaPath,
      resolveAndMakeSchemaSelfContained(rootSchema, schema.$ref),
      rootSchema,
      isInContainer,
      visited.slice().concat(schema.$ref),
      recurse
    );
  } else if (isObject(schema)) {
    const props = [];

    if (isInContainer) {
      const prop: Property = {
        property,
        label,
        schema,
        schemaPath
      };
      props.push(prop);

      if (!recurse) {
        return props;
      }
    }

    return Object.keys(schema.properties).reduce(
      (prev, currentProp) =>
        prev.concat(
          findContainerProps(
            currentProp,
            currentProp,
            `${
              schemaPath.length > 0 ? schemaPath + '.' : ''
            }properties.${currentProp}`,
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
      `${schemaPath}.items`,
      schema.items,
      rootSchema,
      true,
      visited,
      recurse
    );
  } else if (schema.anyOf !== undefined) {
    // TODO: oneOf?
    const init: Property[] = [];
    return reduce(
      schema.anyOf,
      (prev: Property[], anyOfSubSchema: JsonSchema7, index: number) =>
        prev.concat(
          findContainerProps(
            property,
            label,
            `${schemaPath}.anyOf.${index}`,
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
export const findContainerProperties = (
  schema: JsonSchema7,
  rootSchema: JsonSchema7,
  recurse: boolean
): Property[] =>
  findContainerProps(
    'root',
    'root',
    '',
    schema,
    rootSchema,
    false,
    [],
    recurse
  );

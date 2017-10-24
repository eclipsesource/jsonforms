import { JsonSchema } from './models/jsonSchema';
import { Scopable } from './models/uischema';
export declare const compose: (path1: string, path2: string) => string;
/**
 * Convert a schema path (i.e. JSON pointer) to an array by splitting
 * at the '/' character and removing all schema-specific keywords.
 *
 * The returned value can be used to de-reference a root object by folding over it
 * and derefercing the single segments to obtain a new object.
 *
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string[]} an array containing only non-schema-specific segments
 */
export declare const toDataPathSegments: (schemaPath: string) => string[];
/**
 * Remove all schema-specific keywords (e.g. 'properties') from a given path.
 * @example
 * toDataPath('#/properties/foo/properties/bar') === '#/foo/bar')
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string} the path without schema-specific keywords
 */
export declare const toDataPath: (schemaPath: string) => string;
/**
 * Resolve the given schema path against the given instance until the last
 * segment. The returned value allows easy assignment of any new value.
 *
 * @example
 * const pair = getValuePropertyPair(someData, someRef);
 * pair.instance[pair.property] = someValue;
 *
 * @param {any} instance the instance to resolve the path against
 * @param {string} schemaPath the schema path to be resolved
 * @returns {{instance: string, property: string}} an object containing
 *          the resolved instance as well the last fragment of
 */
export declare const getValuePropertyPair: (instance: any, schemaPath: string) => {
    instance: Object;
    property: string;
};
export declare const composeWithUi: (scopableUi: Scopable, path: string) => string;
export declare const resolveData: (data: any, path: any) => any;
/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
export declare const resolveSchema: (schema: JsonSchema, schemaPath: string) => JsonSchema;
/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export declare const findAllRefs: (schema: JsonSchema, result?: ReferenceSchemaMap, resolveTuples?: boolean) => ReferenceSchemaMap;
/**
 * Normalizes the schema and resolves the given ref.
 *
 * @param {JsonSchema} full the JSON schema to resolved the reference against
 * @param {string} reference the reference to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
export declare function retrieveResolvableSchema(full: JsonSchema, reference: string): JsonSchema;
export interface ReferenceSchemaMap {
    [ref: string]: JsonSchema;
}

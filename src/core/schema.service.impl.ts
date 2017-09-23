import * as AJV from 'ajv';
import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { resolveSchema } from '../path.util';
import {
  ContainmentProperty,
  ContainmentPropertyImpl,
  ReferenceProperty,
  ReferencePropertyImpl,
  SchemaService
} from './schema.service';
import * as uuid from 'uuid';
import { JsonForms } from '../core';
import { findAllRefs } from '../path.util';
import { RS_PROTOCOL } from './resource-set';

// TODO configure ajv for json schema 04
const ajv = new AJV({jsonPointers: true});

const isObject = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema): boolean => {
  return schema.items !== undefined;
};
const deepCopy = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object)) as T;
};

const addToArray =
    (key: string, identifyingProperty?: string) =>
    (data: Object) =>
    (valueToAdd: object, neighbourValue?: object, insertAfter = true) => {
  if (data[key] === undefined) {
    data[key] = [];
  }
  if (!_.isEmpty(identifyingProperty) && _.isEmpty(valueToAdd[identifyingProperty])) {
    valueToAdd[identifyingProperty] = uuid.v4();
  }
  const childArray = data[key];
  if (neighbourValue !== undefined && neighbourValue !== null) {
    const index = childArray.indexOf(neighbourValue) as number;
    if (insertAfter) {
      if (index >= 0 && index < (childArray.length - 1)) {
        childArray.splice(index + 1, 0, valueToAdd);

        return;
      }
      // TODO proper logging
      console.warn('Could not add the new value after the given neighbour value. ' +
                  'The new value was added at the end.');
    } else {
      if (index >= 0) {
        childArray.splice(index, 0, valueToAdd);

        return;
      }
      // TODO proper logging
      console.warn('The given neighbour value could not be found. ' +
                  'The new value was added at the end.');
    }
  }
  // default behavior: add at the end
  childArray.push(valueToAdd);

};
const deleteFromArray = (key: string) => (data: object) => (valueToDelete: object) => {
  const childArray = data[key];
  if (!childArray) {
    return;
  }
  const indexToDelete = childArray.indexOf(valueToDelete);
  childArray.splice(indexToDelete, 1);
};
const getArray = (key: string) => (data: object) => {
  return data[key];
};
const addReference = (schema: JsonSchema, identifyingProperty: string, propName: string) =>
  (root: Object, data: Object, toAdd: object) => {

    const refValue = toAdd[identifyingProperty];
    if (schema.properties[propName].type === 'array') {
      if (!data[propName]) {
        data[propName] = [];
      }
      data[propName].push(refValue);
    } else {
      data[propName] = refValue;
    }
  };

// reference resolvement for id based references
const resolveRef = (schema: JsonSchema, findTargets: (rootData: Object) => Object[],
                    identifyingProperty: string, propName: string) =>
  (rootData: Object, data: Object) => {
    if (_.isEmpty(data) || _.isEmpty(identifyingProperty)) {
      return null;
    }
    // get all objects that could be referenced.
    const candidates = findTargets(rootData);

    if (_.isEmpty(schema.properties[propName].type)) {
      throw Error(`The schema of the property '${propName}' does not specify a schema type.`);
    }
    if (schema.properties[propName].type === 'array') {
      const ids: object[] = data[propName];
      const resultList = candidates.filter(value => ids.indexOf(value[identifyingProperty]) > -1);

      // check that there is at most one reference target for every id
      for (const id of ids) {
        const idResults = resultList.filter(result => result[identifyingProperty] === id);
        if (idResults.length > 1) {
          throw Error(`There was more than one possible reference target with value
                      '${JSON.stringify(id)}' in its identifying property
                      '${identifyingProperty}'.`);
        }
      }

      return resultList;
    } else {
      // use identifying property to identify the referenced object
      const resultList = candidates.filter(value => value[identifyingProperty] === data[propName]);

      if (_.isEmpty(resultList)) {
        return null;
      }
      if (resultList.length > 1) {
        throw Error(`There was more than one possible reference target with value
                    '${JSON.stringify(data[propName])}' in its identifying property
                    '${identifyingProperty}'.`);
      }

      return _.first(resultList);
    }
  };

const getFindReferenceTargetsFunction = (pathToContainment: string, schemaId: string) =>
  (rootData: Object) => {
    const candidates = pathToContainment
      .split('/')
      .reduce(
        (elem, path) => {
          if (path === '#') {
            return elem;
          }

          return elem[path];
        },
        rootData) as Object[];
    if (!_.isEmpty(candidates)) {
      return JsonForms.filterObjectsByType(candidates, schemaId);
    }

    return [];
  };

const findRefTargetsFunction = (href: string, targetSchema: JsonSchema, idProp?: string) => () => {
  let targetData: Object;
  let localPath: string;
  if (_.startsWith(href, RS_PROTOCOL)) {
    // TODO extract resource name

    const resourceName = href.substring(RS_PROTOCOL.length).split('/')[0];
    localPath = href.substring(RS_PROTOCOL.length + resourceName.length + 1);
    targetData = JsonForms.resources.getResource(resourceName);
    // reference to data in resource set
  } else if (_.startsWith(href, 'http://')) {
    // remote data
    console.warn(`Remote data resolution is not yet implemented for data links.`);

    return;
  } else if (_.startsWith(href, '#')) {
    // local data
    targetData = JsonForms.rootData;
    localPath = href;
  } else {
    console.error(`'${href}' is not a supported URI to specify reference targets in a link block.`);

    return [];
  }

  // assume targetSchema is resolved
  if (!_.isEmpty(idProp) && !_.isEmpty(targetSchema.id)
      && !_.isEmpty(targetSchema.properties)
      && !_.isEmpty(targetSchema.properties[idProp])) {
    // use id based referencing & reuse existing code for now
    // TODO reuse of existing id behavior sub-optimal (does not search cascaded)
    return getFindReferenceTargetsFunction(localPath, targetSchema.id)(targetData);
  } else {
    // use path based referencing
    return collectReferencePaths(targetData, localPath, targetSchema);
  }
};

/**
 * Retrieves the data that contains the reference targets by resolving the given href uri.
 * Thereby, the root data is gathered based on the protocol and then resolved
 * against the uri's path.
 *
 * Important: This method does not resolve the actual reference targets but only the
 * root data containing them.
 *
 * @return the resolved data containing the reference targets; null if the href cannot be resolved
 */
const getReferenceTargetData = (href: string): Object => {
  let rootData: Object;
  let localPath: string;
  if (_.startsWith(href, RS_PROTOCOL)) {
    const resourceName = href.substring(RS_PROTOCOL.length).split('/')[0];
    localPath = href.substring(RS_PROTOCOL.length + resourceName.length + 1);
    rootData = JsonForms.resources.getResource(resourceName);
    // reference to data in resource set
  } else if (_.startsWith(href, 'http://')) {
    // remote data
    console.warn(`Remote data resolution is not yet implemented for data links.`);

    return null;
  } else if (_.startsWith(href, '#')) {
    // local data
    rootData = JsonForms.rootData;
    localPath = href;
  } else {
    console.error(`'${href}' is not a supported URI to specify reference targets in a link block.`);

    return null;
  }

  return resolveLocalData(rootData, localPath);
};

/**
 * Resolves the given local data path against the root data.
 *
 * @param rootData the root data to resolve the data from
 * @param path The path to resolve against the root data
 * @return the resolved data or null if the path is not a valid path in the root data
 */
const resolveLocalData = (rootData: Object, path: string): Object => {
  let resolvedData = rootData;
  for (const segment of path.split('/')) {
    if (segment === '#' || _.isEmpty(segment)) {
      continue;
    }
    if (_.isEmpty(resolvedData) || !resolvedData.hasOwnProperty(segment)) {
      console.error(`The local path '${path}' cannot be resolved in the given data:`, rootData);

      return null;
    }
    resolvedData = resolvedData[segment];
  }

  return resolvedData;
};

/**
 * Search for all paths to objects that match the targetSchema
 * and are located within the scope (directly or indirectly)
 *
 * @param data The unscoped data to search for reference targets
 * @param scopePath The path defining where to search for reference targets
 *                  within the given data
 * @param targetSchema The schema that valid reference targets have to validate against
 * @return All paths to reference targets as a string array
 */
export const collectReferencePaths = (data: Object, scopePath: string,
                                      targetSchema: JsonSchema)
                                      : string[] => {
  // step 1: scope data
  const scopedRoot = resolveLocalData(data, scopePath);
  // step 2: (recursively) search for targets matching the target schema
  return collectionHelper(scopePath, scopedRoot, targetSchema);

};

// NOTE Json Schema 04 allows additional properties by default. probably needs to be
// restricted to work for finding valid UI Schema targets

/**
 * Recursive method to find all paths to valid reference targets based on the
 * target schema identifying them.
 * This method searches the target based on the given data and calculates the path
 * based on the current location and adding the next path segment for child properties
 * or array elements.
 *
 */
const collectionHelper = (currentPath: string, data: Object, targetSchema: JsonSchema) => {
  let result: string[] = [];
  if (checkData(data, targetSchema)) {
    // must be done  before null check before null might be a valid target
    result.push(currentPath);
  }
  if (data === undefined || data === null) {
    return result;
  }
  if (Array.isArray(data)) {
    // TODO how to deal with array? index? - assume index for now
    for (let i = 0; i < data.length; i++) {
      const childResult = collectionHelper(`${currentPath}/${i}`, data[i], targetSchema);
      result = result.concat(childResult);
    }
  } else if (!_.isEmpty(data) && typeof data !== 'string') {
    Object.keys(data).forEach(key => {
      // NOTE later maybe need to check for refs and thereby circles
      const childResult = collectionHelper(`${currentPath}/${key}`, data[key], targetSchema);
      result = result.concat(childResult);
    });
  }

  return result;
};

const checkData = (data: Object, targetSchema: JsonSchema): boolean => {
  // use AJV to validate data against targetSchema and return result
  return ajv.validate(targetSchema, data);;
};

export class SchemaServiceImpl implements SchemaService {
  private selfContainedSchemas: {[id: string]: JsonSchema} = {};
  constructor(private rootSchema: JsonSchema) {
    if (_.isEmpty(rootSchema.id)) {
      rootSchema.id = '#generatedRootID';
    }
    this.selfContainedSchemas[rootSchema.id] = this.rootSchema;
  }
  getContainmentProperties(schema: JsonSchema): ContainmentProperty[] {
    return this.getContainment('root', 'root', schema, schema, false, null, null, null);
  }
  hasContainmentProperties(schema: JsonSchema): boolean {
    return this.getContainmentProperties(schema).length !== 0;
  }
  getSelfContainedSchema(parentSchema: JsonSchema, refPath: string): JsonSchema {
    let schema = resolveSchema(parentSchema, refPath);
    schema = deepCopy(schema);
    if (_.isEmpty(schema.id)) {
      schema.id = '#' + refPath;
    }
    if (this.selfContainedSchemas.hasOwnProperty(schema.id)) {
      return this.selfContainedSchemas[schema.id];
    }
    this.selfContainSchema(schema, schema, refPath);
    this.selfContainedSchemas[schema.id] = schema;

    return schema;
  }

  getReferenceProperties(schema: JsonSchema): ReferenceProperty[] {
    if (schema.$ref !== undefined) {
      return this.getReferenceProperties(this.getSelfContainedSchema(this.rootSchema, schema.$ref));
    }
    // tslint:disable:no-string-literal
    if (schema['links']) {
      const links = schema['links'];
      // tslint:enable:no-string-literal
      const result: ReferenceProperty[] = [];
      links.forEach(link => {
        if (_.isEmpty(link.targetSchema) || _.isEmpty(link.href)) {
          // FIXME log
          return;
        }
        let targetSchema;
        // TODO what if schema is url but not resolved?
        // Special case: JSON Schema 04 for UI Schema editor
        if (link.targetSchema.$ref !== undefined) {
          targetSchema = this.getSelfContainedSchema(this.rootSchema, link.targetSchema.$ref);
        } else {
          targetSchema = link.targetSchema;
        }
        const href: string = link.href;
        const variableWrapped = href.match(/\{.*\}/)[0];
        const pathToContainment = href.split(/\/\{.*\}/)[0];
        const variable = variableWrapped.substring(1, variableWrapped.length - 1);
        const findTargets = getFindReferenceTargetsFunction(pathToContainment, targetSchema.id);
        const identifyingProp = JsonForms.config.getIdentifyingProp();
        result.push(
          new ReferencePropertyImpl(
            schema.properties[variable],
            targetSchema,
            variable,
            variable,
            findTargets,
            addReference(schema, identifyingProp, variable),
            resolveRef(schema, findTargets, identifyingProp, variable)
          )
        );
      });

      return result;
    }
    if (schema.anyOf !== undefined) {
      return schema.anyOf.reduce((prev, cur) => prev.concat(this.getReferenceProperties(cur)), []);
    }

    return [];
  }

  private getContainment(key: string, name: string, schema: JsonSchema, rootSchema: JsonSchema,
                         isInContainment: boolean,
                         addFunction: (data: object) => (valueToAdd: object,
                                                         neighbourValue?: object,
                                                         insertAfter?: boolean) => void,
                         deleteFunction: (data: object) => (valueToDelete: object) => void,
                         getFunction: (data: object) => Object,
                         // TODO rename
                         internal = false
                       ): ContainmentProperty[] {
    if (schema.$ref !== undefined) {
      return this.getContainment(
        key,
        schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
        this.getSelfContainedSchema(rootSchema, schema.$ref),
        rootSchema,
        isInContainment,
        addFunction,
        deleteFunction,
        getFunction,
        internal
      );
    }
    if (isObject(schema)) {
      if (isInContainment) {

        return [new ContainmentPropertyImpl(schema, key, name, addFunction, deleteFunction,
                                            getFunction)];
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
              this.getContainment(
                cur,
                cur,
                schema.properties[cur],
                rootSchema,
                false,
                addFunction,
                deleteFunction,
                getFunction,
                true
              )
            ),
          []
        );
    }
    if (isArray(schema) && !Array.isArray(schema.items)) {
      return this.getContainment(
        key,
        name,
        schema.items,
        rootSchema,
        true,
        addToArray(key, JsonForms.config.getIdentifyingProp()),
        deleteFromArray(key),
        getArray(key),
        internal
      );
    }
    if (schema.anyOf !== undefined) {
      return schema.anyOf
        .reduce(
          (prev, cur) =>
            prev.concat(
              this.getContainment(
                key,
                undefined,
                cur,
                rootSchema,
                isInContainment,
                addFunction,
                deleteFunction,
                getFunction,
                internal
              )
            ),
          []
        );
    }

    return [];
  }

  /**
   * Makes the given JsonSchema self-contained. This means all referenced definitions
   * are contained in the schema's definitions block and references equal to
   * outerReference are set to root ('#').
   *
   * @param schema The current schema to make self contained
   * @param outerSchema The root schema to which missing definitions are added
   * @param outerReference The reference which is considered to be self ('#')
   * @param includedDefs The list of definitions which were already added to the outer schema
   */
  private selfContainSchema(schema: JsonSchema, outerSchema: JsonSchema,
                            outerReference: string, includedDefs: string[] = ['#']): void {
    // Step 1: get all used references
    const allInnerRefs = findAllRefs(schema);
    Object.keys(allInnerRefs).forEach(innerRef => {
      const resolved = resolveSchema(this.rootSchema, innerRef);
      // Step 2: recognize refs to outer self and set to '#'
      if (innerRef === outerReference || resolved.id === schema.id) {
        if (allInnerRefs[innerRef] !== undefined) {
          if (!_.isEmpty(allInnerRefs[innerRef].$ref)) {
            allInnerRefs[innerRef].$ref = '#';
          }
        }

        return;
      }
      // Step 3: add definitions for non-existant refs to definitions block
      if (includedDefs.indexOf(innerRef) > -1) {
        // definition was already added to schema
        return;
      }
      if (!_.isEmpty(resolved.anyOf)) {
        resolved.anyOf.forEach(inner => {
          this.copyAndResolveInner(inner, innerRef, outerSchema, outerReference, includedDefs);
        });
      } else {
        this.copyAndResolveInner(resolved, innerRef, outerSchema, outerReference, includedDefs);
      }
    });
  }
  private copyAndResolveInner(resolved: JsonSchema, innerRef: string, outerSchema: JsonSchema,
                              outerReference: string, includedDefs: string[]) {
    // get a copy of the referenced type's schema
    const definitionSchema = deepCopy(resolved);
    if (outerSchema.definitions === undefined || outerSchema.definitions === null) {
      outerSchema.definitions = {};
    }
    const defName = innerRef.substr(innerRef.lastIndexOf('/') + 1);
    outerSchema.definitions[defName] = definitionSchema;
    includedDefs.push(innerRef);

    this.selfContainSchema(definitionSchema, outerSchema, outerReference, includedDefs);
  }
}

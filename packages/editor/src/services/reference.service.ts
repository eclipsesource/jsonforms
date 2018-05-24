import { JsonSchema } from '@jsonforms/core';
import { makeSelfContainedSchema, Property } from './property.util';
import { EditorContext } from '../editor-context';
import { Resources } from '../resources/resources';
import { ModelMapping } from '../helpers/containment.util';
import { resolveLocalData } from '../helpers/util';
import { RS_PROTOCOL } from '../resources/resource-set';
import * as AJV from 'ajv';
import * as _ from 'lodash';

const ajv = new AJV({ jsonPointers: true });

/**
 * A ReferenceProperty extends the Property and provides methods
 * which allow to modify reference data.
 */
export interface ReferenceProperty extends Property {
  /**
   * The schema of the referenced elements.
   */
  readonly targetSchema: JsonSchema;
  /**
   * This allows to set the reference.
   *
   * @param data The object to add to
   * @param valueToAdd For id based referencing: The object referenced by the id.
   *                   For path based referencing: the path itself
   */
  addToData(data: Object, valueToAdd: Object): void;
  /**
   * This allows to retrieve the refernced data object(s) of the reference.
   * The result object contains the data objects' identifier (its ID or path) as key
   * and the data object as value.
   *
   * @param data The object that contains the reference
   * @return The referenced value(s).
   *         If no referenced value(s) are found an empty object is returned.
   */
  getData(data: Object): { [key: string]: Object };

  /**
   * Returns true if the references use ids to identify targets and false if they use paths.
   */
  isIdBased(): boolean;

  /**
   * Returns all possible objects which can be referenced by this property.
   * The result object contains targets' identifier (its ID or path) as key
   * and the referencable data object as value
   *
   * @return The object containing possible reference targets. Keys are identifiers of the targets
   *         and values are the actual data objects. If there are no available reference targets,
   *         an empty object is returned.
   */
  findReferenceTargets(data: Object): { [key: string]: Object };
}

export class ReferencePropertyImpl implements ReferenceProperty {
  constructor(
    private innerSchema: JsonSchema,
    private innerTargetSchema: JsonSchema,
    private key: string,
    private name: string,
    private idBased: boolean,
    private findFunction: (data: Object) => { [key: string]: Object },
    private addFunction: (data: object, valueToAdd: object) => void,
    private getFunction: (data: object) => { [key: string]: Object }
  ) {}
  get label(): string {
    return _.find(
      [
        this.innerSchema.title,
        this.name,
        this.innerSchema.id,
        this.key
      ],
      n => !_.isEmpty(n)
    );
  }
  get schema(): JsonSchema {
    return this.innerSchema;
  }
  get property(): string {
    return this.key;
  }
  get targetSchema(): JsonSchema {
    return this.innerTargetSchema;
  }
  addToData(data: object, valueToAdd: Object): void {
    this.addFunction(data, valueToAdd);
  }
  getData(data: object): { [key: string]: Object } {
    return this.getFunction(data);
  }
  isIdBased(): boolean {
    return this.idBased;
  }
  findReferenceTargets(data: Object): {[key: string]: Object} {
    return this.findFunction(data);
  }
}
/**
 * Validates the given data against the given JSON Schema.
 *
 * @return true if the data adheres to the schema, false otherwise
 */
const checkData = (data: Object, targetSchema: JsonSchema): boolean => {
  // use AJV to validate data against targetSchema and return result
  const valid = ajv.validate(targetSchema, data);
  if (_.isBoolean(valid)) {
    return valid;
  }
  return false;
};

const addReference = (schema: JsonSchema, identifyingProperty: string, propName: string) =>
  (data: Object, toAdd: object) => {

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

/**
 * Retrieves the data that contains the reference targets by resolving the given href uri.
 * Thereby, the root data is gathered based on the protocol and then resolved
 * against the uri's path.
 *
 * Important: This method does not resolve the actual reference targets but only the
 * root data containing them.
 *
 * @return the resolved data containing the reference targets; {null} if the href cannot be resolved
 */
const getReferenceTargetData = (data: Object, href: string): Object => {
  let rootData: Object;
  let localTemplatePath: string;
  if (_.startsWith(href, RS_PROTOCOL)) {
    const resourceName = href.substring(RS_PROTOCOL.length).split('/')[0];
    localTemplatePath = href.substring(RS_PROTOCOL.length + resourceName.length + 1);
    rootData = Resources.resourceSet.getResource(resourceName);
    // reference to data in resource set
  } else if (_.startsWith(href, 'http://')) {
    // remote data
    console.warn(`Remote data resolution is not yet implemented for data links.`);

    return null;
  } else if (_.startsWith(href, '#') || (href.match(/\{.*\}/) !== null)) {
    // local data
    rootData = data;
    localTemplatePath = href;
  } else {
    console.error(`'${href}' is not a supported URI to specify reference targets in a link block.`);

    return {};
  }
  const localPath = localTemplatePath.split(/\/\{.*\}/)[0];
  if (localPath.match(/\{.*\}/) !== null) {
    // the local path only contains the template variable
    return rootData;
  }

  return resolveLocalData(rootData, localPath);
};

// reference resolvement for id based references
export const resolveRef = (schema: JsonSchema,
                           findTargets: (data: Object) => { [key: string]: Object },
                           propName: string) => (data: Object): { [key: string]: Object } => {
  if (_.isEmpty(data)) {
    return {};
  }
  // get all objects that could be referenced.
  const candidates = findTargets(data);
  const result = {};
  if (_.isEmpty(schema.properties[propName].type)) {
    throw Error(`The schema of the property '${propName}' does not specify a schema type.`);
  }
  if (schema.properties[propName].type === 'array') {
    const ids = data[propName] as string[];

    // check that there is at most one reference target for every id
    for (const id of ids) {
      const idResult = candidates[id];
      if (idResult === undefined) {
        console.warn(`Could not resolve the referenced data for id '${id}'.`);
        continue;
      }
      result[id] = idResult;
    }
  } else {
    // use identifying property to identify the referenced object
    const id = data[propName];
    const idResult = candidates[id];
    if (idResult === undefined) {
      console.warn(`Could not resolve the referenced data for id '${id}'.`);

      return result;
    }
    result[id] = idResult;
  }

  return result;
};

export const getFindReferenceTargetsFunction =
  (href: string, schemaId: string, idProp: string, modelMapping?: ModelMapping) =>
    (data: Object): { [key: string]: Object } => {
      const candidates = getReferenceTargetData(data, href) as Object[];
      if (!_.isEmpty(candidates)) {
        const result = {};
        for (const candidate of filterObjectsByType(candidates, schemaId, modelMapping)) {
          const id = candidate[idProp];
          result[id] = candidate;
        }

        return result;
      }

      return {};
    };

/**
 * Recursive method to find all paths to valid reference targets based on the
 * target schema identifying them.
 * This method searches the target based on the given data and calculates the path
 * based on the current location and adding the next path segment for child properties
 * or array elements.
 *
 * The result is an object mapping from the found paths to the target data object
 * found at the path.
 */
const collectionHelperMap = (currentPath: string, data: Object, targetSchema: JsonSchema)
  : { [key: string]: Object } => {
  const result = {};
  if (checkData(data, targetSchema)) {
    // must be done before null check before null might be a valid target
    result[currentPath] = data;
  }
  if (data === undefined || data === null) {
    return result;
  }
  if (Array.isArray(data)) {
    // TODO how to deal with array? index? - assume index for now
    for (let i = 0; i < data.length; i++) {
      const childPath = _.isEmpty(currentPath) ? `${i}` : `${currentPath}/${i}`;
      const childResult = collectionHelperMap(childPath, data[i], targetSchema);
      _.assign(result, childResult);
    }
  } else if (!_.isEmpty(data) && typeof data !== 'string') {
    Object.keys(data).forEach(key => {
      // NOTE later maybe need to check for refs and thereby circles
      const childPath = _.isEmpty(currentPath) ? key : `${currentPath}/${key}`;
      const childResult = collectionHelperMap(childPath, data[key], targetSchema);
      _.assign(result, childResult);
    });
  }

  return result;
};

/**
 * Adds the reference path given in toAdd to the data's reference property.
 */
const addPathBasedRef = (schema: JsonSchema, propName: string) =>
  (data: Object, toAdd: object) => {
    if (typeof toAdd !== 'string') {
      console.error(`Path based reference values must be of type string. The given value was of`
        + ` type '${typeof toAdd}' and could not be added.`);

      return;
    }

    // const refValue = toAdd[identifyingProperty];
    if (schema.properties[propName].type === 'array') {
      if (!data[propName]) {
        data[propName] = [];
      }
      data[propName].push(toAdd);
    } else {
      data[propName] = toAdd;
    }
  };

const resolvePathBasedRef = (href: string, pathProperty: string) => (data: Object)
  : { [key: string]: Object } => {
  const targetData = getReferenceTargetData(data, href);
  const paths = data[pathProperty];
  const result = {};
  if (Array.isArray(paths)) {
    for (const path of paths) {
      const curRes = resolveLocalData(targetData, path);
      result[path] = curRes;
    }
  } else {
    result[paths] = resolveLocalData(targetData, paths);
  }

  return result;
};

const getPathBasedRefTargets = (href: string, targetSchema: JsonSchema) => (data: Object)
  : { [key: string]: Object } => {
  const targetData = getReferenceTargetData(data, href);

  if (href.indexOf('#') > -1) {
    return collectionHelperMap('', targetData, targetSchema);
  }

  return collectionHelperMap('#', targetData, targetSchema);
};

/**
 * Uses the model mapping to filter all objects that are associated with the type
 * defined by the given schema id. If there is no applicable mapping,
 * we assume that no mapping is necessary and do not filter out affected data objects.
 *
 * @param objects the list of data objects to filter
 * @param schemaId The id of the JsonSchema defining the type to filter for
 * @return The filtered data objects or all objects if there is no applicable mapping
 */
const filterObjectsByType =
  (objects: Object[], schemaId: string, modelMapping?: ModelMapping): Object[] => {
    // No filtering possible without a mapping, return all
    if (modelMapping === undefined) {
      return objects;
    }

    return objects.filter(value => {
      const valueSchemaId = getSchemaIdForObject(value, modelMapping);
      if (valueSchemaId === null) {
        return true;
      }

      return valueSchemaId === schemaId;
    });
  };

/**
 * Uses the model mapping to find the schema id defining the type of the given object.
 * If no schema id can be determined either because the object is empty, there is no model
 * mapping, or the object does not contain a mappable property.
 * TODO expected behavior?
 *
 * @param object The object whose type is determined
 * @return The schema id of the object or null if it could not be determined
 */
const getSchemaIdForObject = (object: Object, modelMapping: ModelMapping): string => {
  if (modelMapping !== undefined && !_.isEmpty(object)) {
    const mappingAttribute = modelMapping.attribute;
    if (!_.isEmpty(mappingAttribute)) {
      const mappingValue = object[mappingAttribute];
      const schemaElementId: string = modelMapping.mapping[mappingValue];

      return !_.isEmpty(schemaElementId) ? schemaElementId : null;
    }
  }

  return null;
};

/**
 * Retrieves an array of reference properties based on the provided schema.
 * @param schema The schema to check for references
 * @return The array of {@link ReferenceProperty} or empty if no references are available
 * @see ReferenceProperty
 */
export const getReferenceProperties = (schema: JsonSchema,
                                       editorContext: EditorContext): ReferenceProperty[] => {
  if (schema.$ref !== undefined) {
    return getReferenceProperties(
      makeSelfContainedSchema(editorContext.dataSchema, schema.$ref),
      editorContext);
  }
  // tslint:disable:no-string-literal
  if (schema['links']) {
    const links = schema['links'];
    // tslint:enable:no-string-literal
    const result: ReferenceProperty[] = [];
    links.forEach(link => {
      if (_.isEmpty(link.targetSchema) || _.isEmpty(link.href)) {
        console.warn(`Could not create link property because the configuration was invalid`,
                     link);

        return;
      }
      let targetSchema;
      // TODO what if schema is url but not resolved?
      if (link.targetSchema.$ref !== undefined) {
        targetSchema = makeSelfContainedSchema(editorContext.dataSchema,
                                               link.targetSchema.$ref);
      } else if (link.targetSchema.resource !== undefined) {
        const resSchema = Resources.resourceSet.getResource(link.targetSchema.resource);
        if (resSchema === undefined) {
          console.error(`Could not find target schema: There is no resource with name:` +
            `${link.targetSchema.resource}`);

          return [];
        }
        targetSchema = resSchema;
      } else {
        targetSchema = link.targetSchema;
      }

      const href: string = link.href;
      const variableWrapped = href.match(/\{.*\}/)[0];
      const variable = variableWrapped.substring(1, variableWrapped.length - 1);

      let findRefTargets: (data: Object) => { [key: string]: Object };
      let resolveReference: (data: Object) => { [key: string]: Object };
      let addToReference: (data: Object, toAdd: object) => void;
      let idBased: boolean;

      // assume targetSchema is resolved
      if (!_.isEmpty(editorContext.identifyingProperty) && !_.isEmpty(targetSchema.id)
        && !_.isEmpty(targetSchema.properties)
        && !_.isEmpty(targetSchema.properties[editorContext.identifyingProperty])) {
        // use id based referencing & reuse existing code for now
        // TODO reuse of existing id behavior sub-optimal (does not search cascaded)
        idBased = true;
        const schemaId = targetSchema.id as string;
        findRefTargets = getFindReferenceTargetsFunction(href, schemaId,
                                                         editorContext.identifyingProperty,
                                                         editorContext.modelMapping);
        resolveReference = resolveRef(schema, findRefTargets, variable);
        addToReference = addReference(schema, editorContext.identifyingProperty, variable);
      } else {
        // use path based referencing
        idBased = false;
        findRefTargets = getPathBasedRefTargets(href, targetSchema);
        resolveReference = resolvePathBasedRef(href, variable);
        addToReference = addPathBasedRef(schema, variable);
      }

      result.push(
        new ReferencePropertyImpl(
          schema.properties[variable],
          targetSchema,
          variable,
          variable,
          idBased,
          findRefTargets,
          addToReference,
          resolveReference
        )
      );
    });

    return result;
  }
  if (schema.anyOf !== undefined) {
    return schema.anyOf.reduce(
      (prev, cur) =>
        prev.concat(getReferenceProperties(cur, editorContext)),
      []);
  }

  return [];
};

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

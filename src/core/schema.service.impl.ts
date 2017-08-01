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

interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}
const isObject = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema): boolean => {
  return schema.items !== undefined;
};
const deepCopy = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object)) as T;
};
const findAllRefs = (schema: JsonSchema, result: ReferenceSchemaMap = {}): ReferenceSchemaMap => {
  if (isObject(schema)) {
    Object.keys(schema.properties).forEach(key =>
      findAllRefs(schema.properties[key], result));
  }
  if (isArray(schema)) {
    // FIXME Do we want to support tupples? If so how do we render this?
    if (!Array.isArray(schema.items)) {
      findAllRefs(schema.items, result);
    }
  }
  if (Array.isArray(schema.anyOf)) {
    schema.anyOf.forEach(child => findAllRefs(child, result));
  }
  if (schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }
  // tslint:disable:no-string-literal
  if (schema['links'] !== undefined) {
    schema['links'].forEach(link => result[link.targetSchema.$ref] = schema);
  }
  // tslint:enable:no-string-literal

  return result;
};
const addToArray = (key: string) => (data: Object) => (valueToAdd: object, neighbourValue?: object,
                                                       insertAfter = true) => {
  if (data[key] === undefined) {
    data[key] = [];
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
const addReference = (schema: JsonSchema, variable: string, pathToContainment: string) =>
  (root: Object, data: Object, toAdd: object) => {
    const containment = pathToContainment
      .split('/')
      .reduce(
        (elem, path) => {
          if (path === '#' || path === '') {
            return elem;
          }

          return elem[path];
        },
        root
      );
    const index = (containment as Object[]).indexOf(toAdd);
    if (schema.properties[variable].type === 'array') {
      if (!data[variable]) {
        data[variable] = [];
      }
      data[variable].push(index);
    } else {
      data[variable] = index;
    }
  };
const getReference = (href: string, variable: string, variableWrapped: string) =>
  (root: Object, data: Object) => {
    const variableValue = data[variable];
    const pathToObject = href.replace(variableWrapped, variableValue);

    return pathToObject
      .split('/')
      .reduce(
        (elem, path) => {
          if (path === '#') {
            return elem;
          }

          return elem[path];
        },
        root
      );
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
        const targetSchema = this.getSelfContainedSchema(this.rootSchema, link.targetSchema.$ref);
        const href: string = link.href;
        const variableWrapped = href.match(/\{.*\}/)[0];
        const pathToContainment = href.split(/\{.*\}/)[0];
        const variable = variableWrapped.substring(1, variableWrapped.length - 1);
        result.push(
          new ReferencePropertyImpl(
            schema.properties[variable],
            targetSchema,
            variable,
            variable,
            pathToContainment.substring(0, pathToContainment.length - 1),
            addReference(schema, variable, pathToContainment),
            getReference(href, variable, variableWrapped)
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
                         getFunction: (data: object) => Object): ContainmentProperty[] {
    if (schema.$ref !== undefined) {
      return this.getContainment(
        key,
        schema.$ref === '#' ? undefined : schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
        this.getSelfContainedSchema(rootSchema, schema.$ref),
        rootSchema,
        isInContainment,
        addFunction,
        deleteFunction,
        getFunction
      );
    }
    if (isObject(schema)) {
      return isInContainment ? [
        new ContainmentPropertyImpl(schema, key, name, addFunction, deleteFunction, getFunction)
      ] : Object.keys(schema.properties)
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
                getFunction
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
        addToArray(key),
        deleteFromArray(key),
        getArray(key)
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
                getFunction
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

import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { resolveSchema } from '../path.util';
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
const addToArray = (key: string) => (data: Object) => (valueToAdd: object) => {
  if (data[key] === undefined) {
    data[key] = [];
  }
  const childArray = data[key];
  childArray.push(valueToAdd);
};
const deleteFromArray = (key: string) => (data: object) => (valueToDelete: object) => {
  const childArray = data[key];
  if (!childArray) {
    return;
  }
  const indexToDelete = childArray.indexOf(valueToDelete);
  childArray.splice(indexToDelete - 1, 1);
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
/**
 * A Property wraps a JsonSchema and provides additional information
 * like a label and the property key.
 */
export interface Property {
  /**
   * The label is a text donating a human readable name of the schema the property describes.
   */
  readonly label: string;
  /**
   * The property is a text donating the schema key from which this property was created.
   */
  readonly property: string;
  /**
   * The schema is the JsonSchema this property describes.
   */
  readonly schema: JsonSchema;
}
/**
 * A ContainmentProperty extends the Property and provides methods
 * which allow to modify containment data.
 * @see Property
 */
export interface ContainmentProperty extends Property {
  /**
   * This allows to add data to the containment.
   * @param data The object to add to
   * @return a function that expects the element to be added
   */
  addToData(data: Object): (valueToAdd: object) => void;
  /**
   * This allows to delete data from the containment.
   * The result is a function accepting the value to delete.
   * @param data The object to delete from
   * @return function accepting the value to delete
   */
  deleteFromData(data: Object): (valueToDelete: object) => void;
  /**
   * This allows to retrieve the data of the containment.
   * @param data The object the containment is in
   * @return The containment value (e.g. an array)
   */
  getData(data: Object): Object;
}
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
   * @param root The root object, needed for matching the valueToAdd
   * @param data The object to add to
   * @param valueToAdd The object to add
   */
  addToData(root: Object, data: Object, valueToAdd: object): void;
  /**
   * This allows to retrieve the data of the reference.
   * @param root The root object, needed for finding the value to retrieve
   * @param data The object the reference is in
   * @return The referenced value
   */
  getData(root: Object, data: Object): Object;
}

class ContainmentPropertyImpl implements ContainmentProperty {
  constructor(private innerSchema: JsonSchema,
              private key: string,
              private name: string,
              private addFunction: (data: object) => (valueToAdd: object) => void,
              private deleteFunction: (data: object) => (valueToDelete: object) => void,
              private getFunction: (data: object) => Object) {}
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
  addToData(data: object): (valueToAdd: object) => void {
    return this.addFunction(data);
  }
  deleteFromData(data: object): (valueToDelete: object) => void {
    return this.deleteFunction(data);
  }
  getData(data: object): Object {
    return this.getFunction(data);
  }
}
class ReferencePropertyImpl implements ReferenceProperty {
  constructor(
    private innerSchema: JsonSchema,
    private innerTargetSchema: JsonSchema,
    private key: string,
    private name: string,
    private addFunction: (root: object, data: object, valueToAdd: object) => void,
    private getFunction: (root: object, data: object) => Object
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
  addToData(root: object, data: object, valueToAdd: object): void {
    this.addFunction(root, data, valueToAdd);
  }
  getData(root: object, data: object): Object {
    return this.getFunction(root, data);
  }
}

export const isContainmentProperty = (property: Property): property is ContainmentProperty => {
  return property instanceof ContainmentPropertyImpl;
};
export const isReferenceProperty = (property: Property): property is ReferenceProperty => {
  return property instanceof ReferencePropertyImpl;
};

/**
 * The Schema Service allows to retrieve containments and references.
 */
export interface SchemaService {
  /**
   * Retrieves an array of containment properties based on the provided schema.
   * @param schema The schema to check for containments
   * @return The array of {@link ContainmentProperty} or empty if no containments are available
   * @see ContainmentProperty
   */
  getContainmentProperties(schema: JsonSchema): ContainmentProperty[];
  /**
   * Checks whether a containment properties are available in the provided schema.
   * @param schema The schema to check for containments
   * @return true if containment properties are available, false otherwise
   * @see {@link getContainmentProperties}
   */
  hasContainmentProperties(schema: JsonSchema): boolean;
  /**
   * Retieves a self contained schema.
   * @param parentSchema The schema to use for resolvement
   * @param refPath The path to resolve
   * @return a JsonSchema that is self-contained
   */
  getSelfContainedSchema(parentSchema: JsonSchema, refPath: string): JsonSchema;
  /**
   * Retrieves an array of reference properties based on the provided schema.
   * @param schema The schema to check for references
   * @return The array of {@link ReferenceProperty} or empty if no references are available
   * @see ReferenceProperty
   */
  getReferenceProperties(schema: JsonSchema): ReferenceProperty[];
}
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
                         addFunction: (data: object) => (valueToAdd: object) => void,
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
            // tslint:disable:no-string-literal
          } else if (!_.isEmpty(allInnerRefs[innerRef]['links'])) {
            allInnerRefs[innerRef]['links'].forEach(link => {
              // tslint:enable:no-string-literal
              if (link.targetSchema.$ref === innerRef) {
                link.targetSchema.$ref = '#';
              }
            });
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

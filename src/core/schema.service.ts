import {JsonSchema} from '../models/jsonSchema';
import {resolveSchema} from '../path.util';
interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}
export interface Property {
  readonly label: string;
  readonly property: string;
  readonly schema: JsonSchema;
}
export interface ContainmentProperty extends Property {
  addToData: (data: object, valueToAdd: object) => void;
  deleteFromData: (data: object) => (valueToDelete: object) => void;
  getData: (data: object) => Object;
}
export interface RefrenceProperty extends Property {
  readonly targetSchema: JsonSchema;
  addToData: (root: object, data: object, valueToAdd: object) => void;
  getData: (root: object, data: object) => Object;
}
export function isContainmentProperty(property: Property): property is ContainmentProperty {
    return property['getData'].length === 1;
}
export function isRefrenceProperty(property: Property): property is RefrenceProperty {
    return property['getData'].length === 2;
}
class ContainmentPropertyImpl implements ContainmentProperty {
  constructor(private _schema: JsonSchema,  private key: string, private name: string,
    private addFunction: (data: object, valueToAdd: object) => void,
    private deleteFunction: (data: object) => (valueToDelete: object) => void,
    private getFunction: (data: object) => Object
  ) {}
  get label(): string {
    return this._schema.title || this.name || this._schema.id || this.key;
  }
  get schema(): JsonSchema {
    return this._schema;
  }
  get property(): string {
    return this.key;
  }
  addToData(data: object, valueToAdd: object): void {
    this.addFunction(data, valueToAdd);
  }
  deleteFromData(data: object): (valueToDelete: object) => void {
    return this.deleteFunction(data);
  }
  getData(data: object): Object {
    return this.getFunction(data);
  }
}
class RefrencePropertyImpl implements RefrenceProperty {
  constructor(private _schema: JsonSchema, private _targetSchema: JsonSchema,  private key: string,
    private name: string,
    private addFunction: (root: object, data: object, valueToAdd: object) => void,
    private getFunction: (root: object, data: object) => Object
  ) {}
  get label(): string {
    return this._schema.title || this.name || this._schema.id || this.key;
  }
  get schema(): JsonSchema {
    return this._schema;
  }
  get property(): string {
    return this.key;
  }
  get targetSchema(): JsonSchema {
    return this._targetSchema;
  }
  addToData(root: object, data: object, valueToAdd: object): void {
    this.addFunction(root, data, valueToAdd);
  }
  getData(root: object, data: object): Object {
    return this.getFunction(root, data);
  }
}
export interface SchemaService {
  getContainmentProperties(schema: JsonSchema): Array<ContainmentProperty>;
  hasContainmentProperties(schema: JsonSchema): boolean;
  getSelfContainedSchema(parentSchema: JsonSchema, refPath: string): JsonSchema;
  getReferenceProperties(schema: JsonSchema): Array<RefrenceProperty>;
}
export class SchemaServiceImpl implements SchemaService {
  private selfContainedSchemas: {[id: string]: JsonSchema} = {};
  constructor(private rootSchema: JsonSchema) {
    if (!rootSchema.id) {
      rootSchema.id = '#generatedRootID';
    }
    this.selfContainedSchemas[rootSchema.id] = this.rootSchema;
  }
  getContainmentProperties(schema: JsonSchema): Array<ContainmentProperty> {
    // if (schema.$ref) {
    //   return this.getContainmentProperties(this.getSelfContainedSchema(schema, schema.$ref));
    // }
    // if (schema.anyOf) {
    //   return schema.anyOf.reduce((acc, cur) => acc.concat(this.getContainmentProperties(cur)), []);
    // }
    // if (schema.properties) {
    //   return Object.keys(schema.properties).
    //   reduce((prev, cur) => prev.concat(
    //     this.getContainment(cur, cur, schema.properties[cur], schema, false, () => {/*no-op*/},
    //     () => () => {/*no-op*/}, (data) => data[cur])),
    //     []);
    // }
    // return [];
    return this.getContainment('root', 'root', schema, schema, false, null, null, null);
  }
  hasContainmentProperties(schema: JsonSchema): boolean {
    return this.getContainmentProperties(schema).length !== 0;
  }
  getSelfContainedSchema(parentSchema: JsonSchema, refPath: string): JsonSchema {
    let schema = resolveSchema(parentSchema, refPath);
    if (!schema.id) {
      schema.id = '#' + refPath;
    }
    if (this.selfContainedSchemas.hasOwnProperty(schema.id)) {
      return this.selfContainedSchemas[schema.id];
    }
    schema = this.deepCopy(schema);
    this.selfContainSchema(schema, schema, refPath);
    this.selfContainedSchemas[schema.id] = schema;
    return schema;
  }

  getReferenceProperties(schema: JsonSchema): Array<RefrenceProperty> {
    if (schema.$ref !== undefined) {
      return this.getReferenceProperties(this.getSelfContainedSchema(schema, schema.$ref));
    }
    if (schema['links']) {
      const links = schema['links'];
      const result: Array<RefrenceProperty> = [];
      links.forEach(link => {
        if (!link.targetSchema || !link.href) {
          // FIXME log
          return;
        }
        const targetSchema = this.getSelfContainedSchema(this.rootSchema, link.targetSchema);
        const href: string = link.href;
        const variableWrapped = href.match(/\{.*\}/)[0];
        const pathToContainment = href.split(/\{.*\}/)[0];
        const variable = variableWrapped.substring(1, variableWrapped.length - 1);
        result.push(
          new RefrencePropertyImpl(schema.properties[variable], targetSchema, variable, variable,
            (root, data, toAdd) => {
              const containment = pathToContainment.split('/').reduce((elem, path) => {
                if (path === '#' || path === '') {return elem; }
                return elem[path];
              }, root);
              const index = (<Array<Object>>containment).indexOf(toAdd);
              if (schema.properties[variable].type === 'array') {
                data[variable].push(index);
              } else {
                data[variable] = index;
              }
            },
            (root, data) => {
              const variableValue = data[variable];
              const pathToObject = href.replace(variableWrapped, variableValue);
              return pathToObject.split('/').reduce((elem, path) => {
                if (path === '#') {return elem; }
                return elem[path];
              }, root);
            }
          )
        );
      });
      return result;
    }
    if (schema.anyOf !== undefined) {
      return schema.anyOf.reduce((prev, cur) => prev.concat(this.getReferenceProperties(cur)), []);
    }
    return [];
    /*
    if (schema.$ref) {
      return this.getReferenceProperties(this.getSelfContainedSchema(schema, schema.$ref));
    }
    return Object.keys(schema.properties).
      reduce((prev, cur) => prev.concat(
        this.getReference(cur, cur, schema.properties[cur], schema, false, () => {},
          () => () => {}, (data) => data[cur])),
      []);
    */
  }
  private getContainment(key: string, name: string, schema: JsonSchema, rootSchema: JsonSchema,
    isInContainment: boolean,
    addFunction: (data: object, valueToAdd: object) => void,
    deleteFunction: (data: object) => (valueToDelete: object) => void,
    getFunction: (data: object) => Object
    ): Array<ContainmentProperty> {
    if (schema.$ref !== undefined) {
      return this.getContainment(key, schema.$ref === '#' ? undefined :
        schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1),
        this.getSelfContainedSchema(rootSchema, schema.$ref), rootSchema, isInContainment,
          addFunction, deleteFunction, getFunction);
    }
    if (this.isObject(schema)) {
      return isInContainment ? [
        new ContainmentPropertyImpl(schema, key, name, addFunction, deleteFunction, getFunction)
      ] : Object.keys(schema.properties).
        reduce((prev, cur) => prev.concat(
          this.getContainment(cur, cur, schema.properties[cur], rootSchema, false, addFunction,
          deleteFunction, getFunction)),
          []);
    }
    if (this.isArray(schema) && !Array.isArray(schema.items)) {
      return this.getContainment(key, name, schema.items, rootSchema, true,
        (data: object, valueToAdd: object) => {
        if (data[key] === undefined) {
          data[key] = [];
        }
        const childArray = data[key];
        childArray.push(valueToAdd);
      }, (data: object) => (valueToDelete: object) => {
        const childArray = data[key];
        const indexToDelete = childArray.indexOf(valueToDelete);
        childArray.splice(indexToDelete - 1, 1);
      }, (data: object) => {
        return data[key];
      });
    }
    if (schema.anyOf !== undefined) {
      return schema.anyOf.reduce((prev, cur) => prev.concat(
        this.getContainment(key, undefined, cur, rootSchema, isInContainment, addFunction,
          deleteFunction, getFunction)),
      []);
    }
    // if (this.isReference(schema)) {
    //   return [];
    // }
    return [];
  }
  private isObject(schema: JsonSchema): boolean {
    return schema.properties !== undefined;
  }
  private isArray(schema: JsonSchema): boolean {
    return schema.items !== undefined;
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
    outerReference: string, includedDefs: Array<string> = ['#']): void {
      // Step 1: get all used references
      const allInnerRefs = this.findAllRefs(schema);
      Object.keys(allInnerRefs).forEach(innerRef => {
        const resolved = resolveSchema(this.rootSchema, innerRef);
        // Step 2: recognize refs to outer self and set to '#'
        if (innerRef === outerReference || resolved.id === schema.id) {
          if (allInnerRefs[innerRef] !== undefined) {
            if (allInnerRefs[innerRef].$ref) {
              allInnerRefs[innerRef].$ref = '#';
            } else if (allInnerRefs[innerRef]['links']) {
              allInnerRefs[innerRef]['links'].forEach(link => {
                if (link.targetSchema === innerRef) {
                  link.targetSchema = '#';
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
        if (resolved.anyOf) {
            resolved.anyOf.forEach(inner =>
              this.copyAndResolveInner(inner, innerRef, outerSchema, outerReference, includedDefs))
        } else {
          this.copyAndResolveInner(resolved, innerRef, outerSchema, outerReference, includedDefs);
        }
      });
  }
  private copyAndResolveInner(resolved: JsonSchema, innerRef: string, outerSchema: JsonSchema,
    outerReference: string, includedDefs: Array<string>) {
    // get a copy of the referenced type's schema
    const definitionSchema = this.deepCopy(resolved);
    if (outerSchema.definitions === undefined || outerSchema.definitions === null) {
      outerSchema.definitions = {};
    }
    outerSchema.definitions[resolved.id] = definitionSchema;
    includedDefs.push(innerRef);
    // Step 4: recursively self-contain added definition
    this.selfContainSchema(definitionSchema, outerSchema, outerReference, includedDefs);
  }
  private deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
  }
  private findAllRefs (schema: JsonSchema, result: ReferenceSchemaMap = {}): ReferenceSchemaMap {
    if (schema.type === 'object' && schema.properties !== undefined) {
      Object.keys(schema.properties).forEach(key =>
          this.findAllRefs(schema.properties[key], result));
    }
    if (schema.type === 'array' && schema.items !== undefined) {
      // FIXME Do we want to support tupples? If so how do we render this?
      if (Array.isArray(schema.items)) {
        schema.items.forEach(child => this.findAllRefs(child, result));
      } else {
        this.findAllRefs(schema.items, result);
      }
    }
    if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach(child => this.findAllRefs(child, result));
    }
    if (schema.$ref !== undefined) {
      result[schema.$ref] = schema;
    }
    if (schema['links'] !== undefined) {
      schema['links'].forEach(link => result[link.targetSchema] = schema);
    }
    return result;
  }
}
export let SchemaServiceInstance: SchemaService;
export const instantiateSchemaService = (schema: JsonSchema): void => {
  SchemaServiceInstance =  new SchemaServiceImpl(schema);
}

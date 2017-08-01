import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { JsonForms } from '../core';
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
   * @return a function that expects the element to be added and optionally the value next to which
   *         the new value is added. insertAfter defines whether the new value should be added
   *         after or before the neighbourValue. If no neighbour value is provided or it does not
   *         exist in the containment, the valueToAdd is inserted at the end.
   */
  addToData(data: Object): (valueToAdd: object, neighbourValue?: object,
                            insertAfter?: boolean) => void;
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

  /**
   * Returns all possible values which can be referenced.
   * @param root The root object needed for finding the values
   */
  getOptions(root: Object): Object[];
}

export class ContainmentPropertyImpl implements ContainmentProperty {
  constructor(private innerSchema: JsonSchema,
              private key: string,
              private name: string,
              private addFunction: (data: object) => (valueToAdd: object,
                                                      neighbourValue?: object,
                                                      insertAfter?: boolean) => void,
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
  addToData(data: object): (valueToAdd: object, neighbourValue?: object, insertAfter?: boolean)
      => void {
    return this.addFunction(data);
  }
  deleteFromData(data: object): (valueToDelete: object) => void {
    return this.deleteFunction(data);
  }
  getData(data: object): Object {
    return this.getFunction(data);
  }
}
export class ReferencePropertyImpl implements ReferenceProperty {
  constructor(
    private innerSchema: JsonSchema,
    private innerTargetSchema: JsonSchema,
    private key: string,
    private name: string,
    private pathToContainment: string,
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
  getOptions(root: Object): Object[] {
    const candidates = this.pathToContainment
      .split('/')
      .reduce(
        (prev, cur) => {
          if (cur === '#') {
            return prev;
          }

          return prev[cur];
        },
        root) as Object[];

    return JsonForms.filterObjectsByType(candidates, this.targetSchema.id);
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

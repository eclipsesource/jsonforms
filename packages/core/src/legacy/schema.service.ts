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
   * Returns all possible objects which can be referenced by this property.
   *
   * @param root The root data object needed for finding the values
   * @return The array of data objects which are possible reference targets
   *         for this reference property.
   */
  findReferenceTargets(rootData: Object): Object[];

  /**
   * Resolves a reference value for this Reference by using the given porpertyValue to
   * identify the referenced Object.
   *
   * @param rootData The root data object needed for finding the referenced value.
   * @param propertyValue The property value identifying the referenced data object.
   * @return The resolved data object or null if it coiuld not be resolved.
   */
  resolveReference(rootData: Object, propertyValue: string): Object;
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
    private identifyingProperty: string,
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
  findReferenceTargets(rootData: Object): Object[] {
    const candidates = this.pathToContainment
      .split('/')
      .reduce(
        (prev, cur) => {
          if (cur === '#') {
            return prev;
          }

          return prev[cur];
        },
        rootData) as Object[];
    if (!_.isEmpty(candidates)) {
      return JsonForms.filterObjectsByType(candidates, this.targetSchema.id);
    }

    return [];
  }

  resolveReference(rootData: Object, propertyValue: string): Object {
    if (_.isEmpty(propertyValue) || _.isEmpty(this.identifyingProperty)) {
      return null;
    }
    // get all objects that could be referenced.
    const candidates = this.findReferenceTargets(rootData);
    // use identifying property to identify the referenced property by the given propertyValue
    const resultList = candidates.filter(value => {
      return value[this.identifyingProperty] === propertyValue;
    });

    if (_.isEmpty(resultList)) {
      return null;
    }
    if (resultList.length > 1) {
      throw Error('There was more than one possible reference target with value \'' + propertyValue
                  + '\' in the identifying property \'' + this.identifyingProperty + '\'.');
    }

    return _.first(resultList);
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

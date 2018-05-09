import * as _ from 'lodash';
import { JsonSchema } from '@jsonforms/core';
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

export class PropertyImpl implements Property {
  constructor(private innerSchema: JsonSchema,
              private key: string,
              private name: string) {}
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

export const isReferenceProperty = (property: Property): property is ReferenceProperty => {
  return property instanceof ReferencePropertyImpl;
};

/**
 * The Schema Service allows to retrieve containments and references.
 */
export interface SchemaService {
  /**
   * Retrieves an array of container properties based on the provided schema.
   * @param schema The schema to check for container properties
   * @return The array of {@link Property} or empty if no container properties are available
   * @see Property
   */
  getContainerProperties(schema: JsonSchema): Property[];
  /**
   * Checks whether container properties are available in the provided schema.
   * @param schema The schema to check for container properties
   * @return true if container properties are available, false otherwise
   * @see {@link getContainerProperties}
   */
  hasContainerProperties(schema: JsonSchema): boolean;
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

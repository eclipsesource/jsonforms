import {JsonSchema} from '../models/jsonSchema';
import {FullDataModelType, isItemModel, isMultipleItemModel, isReferenceModel} from './item_model';
import {resolveSchema} from '../path.util';

export function extractSchemaFromModel(model: FullDataModelType): JsonSchema {
  if (isItemModel(model)) {
    return model.schema;
  } else if (isMultipleItemModel(model)) {
    // TODO multiple item model
    return undefined;
  } else if (isReferenceModel(model)) {
    return this.extractSchemaFromModel(model.targetModel);
  }
}

export function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}

export interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}

export const findAllRefs = (schema: JsonSchema, result: ReferenceSchemaMap = {}):
  ReferenceSchemaMap => {
  if (schema.type === 'object' && schema.properties !== undefined) {
    Object.keys(schema.properties).forEach(key => findAllRefs(schema.properties[key], result));
  }
  if (schema.type === 'array' && schema.items !== undefined) {
    // FIXME Do we want to support tupples? If so how do we render this?
    if (Array.isArray(schema.items)) {
      schema.items.forEach(child => findAllRefs(child, result));
    }
    findAllRefs(schema.items, result);
  }
  if (Array.isArray(schema.anyOf)) {
      schema.anyOf.forEach(child => findAllRefs(child, result));
  }
  if (schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }
  if (schema['links'] !== undefined) {
    schema['links'].forEach(link => result[link.targetSchema] = schema);
  }
  return result;
};

export function retrieveResolvableSchema(full: JsonSchema, reference: string): JsonSchema {
  const child = resolveSchema(full, reference);
  if (!isItemModel(child)) {
    return undefined;
  }
  const allRefs = findAllRefs(child.schema);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }
  return child.schema;
};

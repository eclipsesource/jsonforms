import {JsonSchema} from '../models/jsonSchema';
import {FullDataModelType, isItemModel, isMultipleItemModel, isReferenceModel} from './item_model';

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

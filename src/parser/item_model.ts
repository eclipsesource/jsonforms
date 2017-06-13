import {JsonSchema} from '../models/jsonSchema';
export type FullDataModelType = DummyModel|DataModelType;
export type DataModelType = ItemModel|MultipleItemModel|ReferenceModel;
export interface DummyModel {}
export interface ItemModel {
  label: string;
  // fullschema: JsonSchema;
  schema: JsonSchema;
  dropPoints: {[property: string]: DataModelType};
  attributes: {[property: string]: ItemModel};
  type: ITEM_MODEL_TYPES
}
export interface MultipleItemModel {
  models: Array<ItemModel>;
  type: MULTIPLICITY_TYPES;
}
export interface ReferenceModel {
  label: string;
  href: string;
  schema: JsonSchema;
  targetModel: DataModelType;
}
export enum MULTIPLICITY_TYPES {
  ALL_OF, ANY_OF, ONE_OF, NOT
}
export enum ITEM_MODEL_TYPES {
  SINGLE, ARRAY, OBJECT
}

export function isItemModel
  (model: FullDataModelType): model is ItemModel {
    return (<ItemModel>model).dropPoints !== undefined;
}
export function isMultipleItemModel
  (model: FullDataModelType): model is MultipleItemModel {
    return (<MultipleItemModel>model).type !== undefined &&
      (<MultipleItemModel>model).models !== undefined;
}
export function isDummyModel
  (model: FullDataModelType): model is DummyModel {
    return Object.keys(model).length === 1;
}
export function isReferenceModel
  (model: FullDataModelType): model is ReferenceModel {
    return (<ReferenceModel>model).href !== undefined;
}

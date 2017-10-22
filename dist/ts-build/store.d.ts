import { JsonFormsStore } from './json-forms';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';
export declare const createJsonFormsStore: (initialState: any) => JsonFormsStore;
export declare const initJsonFormsStore: (data: any, schema: JsonSchema, uischema: UISchemaElement) => JsonFormsStore;

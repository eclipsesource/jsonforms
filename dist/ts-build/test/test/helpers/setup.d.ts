import 'jsdom-global/register';
import { JsonFormsStore } from '../../src/json-forms';
import { JsonSchema } from '../../src/models/jsonSchema';
import { UISchemaElement } from '../../src/models/uischema';
import '../../src/renderers';
export declare const dispatchInputEvent: (input: HTMLElement) => void;
export declare const initJsonFormsStore: (data: any, schema: JsonSchema, uischema: UISchemaElement) => JsonFormsStore;

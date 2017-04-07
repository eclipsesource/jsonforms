import { ControlElement, ILabelObject } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
export declare const startCase: (label: string) => string;
export declare const getElementLabelObject: (schema: JsonSchema, controlElement: ControlElement) => ILabelObject;

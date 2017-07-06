import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, ILabelObject } from '../models/uischema';
/**
 * Return a label object based on the given JSON schema and control element.
 * @param {JsonSchema} schema the JSON schema that the given control element is referring to
 * @param {ControlElement} controlElement the UI schema to obtain a label object for
 * @returns {ILabelObject}
 */
export declare const getElementLabelObject: (schema: JsonSchema, controlElement: ControlElement) => ILabelObject;

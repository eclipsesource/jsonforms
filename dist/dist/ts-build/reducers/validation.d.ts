import { ErrorObject, ValidateFunction } from 'ajv';
import { JsonSchema } from '../models/jsonSchema';
export interface ValidationState {
    errors: ErrorObject[];
    validator: ValidateFunction;
    schema: JsonSchema;
}
export declare const validationReducer: (state: ValidationState, action: any) => ValidationState;
export declare const errorAt: (instancePath: any) => (state: any) => any[];

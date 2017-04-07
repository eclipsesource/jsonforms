import { JsonSchema } from './models/jsonSchema';
export declare const getValuePropertyPair: (instance: any, path: string) => {
    instance: Object;
    property: string;
};
export declare const toDataPath: (path: string) => string;
export declare const resolveSchema: (schema: JsonSchema, path: string) => JsonSchema;
export declare const retrieveResolvableSchema: (full: JsonSchema, reference: string) => JsonSchema;

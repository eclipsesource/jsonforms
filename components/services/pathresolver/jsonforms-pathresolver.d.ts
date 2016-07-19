import { SchemaElement } from '../../../jsonschema';
export interface IPathResolver {
    toInstancePath(schemaPath: string): string;
    resolveUi(instance: any, uiPath: string): any;
    resolveInstance(instance: any, path: string): any;
    resolveSchema(schema: SchemaElement, schemaPath: string): SchemaElement;
    lastFragment(path: string): string;
    resolveToLastModel(instance: any, path: string): any;
}
export declare class PathResolver implements IPathResolver {
    private pathMapping;
    toInstancePath(path: string): string;
    resolveUi(instance: any, uiPath: string): any;
    resolveInstance(instance: any, schemaPath: string): any;
    resolveSchema(schema: any, path: string): any;
    lastFragment(schemaPath: string): string;
    resolveToLastModel(instance: any, schemaPath: string): any;
    private innerResolveInstance(instance, schemaPath, createMissing);
}

export declare class RefResolver {
    toInstancePath(path: string): string;
    resolveUi(instance: any, uiPath: string): any;
    resolveInstance(instance: any, schemaPath: string): any;
    resolveSchema(schema: any, path: string): any;
    lastFragment(schemaPath: string): string;
    resolveToLastModel(instance: any, schemaPath: string): any;
    private innerResolveInstance(instance, schemaPath, createMissing);
}
export declare const PathResolver: RefResolver;

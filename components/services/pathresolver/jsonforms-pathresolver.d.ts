export declare class PathResolver {
    static toInstancePath(path: string): string;
    static resolveUi(instance: any, uiPath: string): any;
    static resolveInstance(instance: any, schemaPath: string): any;
    static resolveSchema(schema: any, path: string): any;
    static lastFragment(schemaPath: string): string;
    static resolveToLastModel(instance: any, schemaPath: string): any;
    private static innerResolveInstance(instance, schemaPath, createMissing);
}

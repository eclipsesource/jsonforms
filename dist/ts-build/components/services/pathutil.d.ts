export declare class PathUtil {
    private static Keywords;
    private static joinWithSlash;
    private static numberRegex;
    static normalize(schemaPath: string): string;
    static normalizeFragments(schemaPath: string): string[];
    static toPropertyFragments(path: string): string[];
    static toPropertyAccessString(propertyPath: string): string;
    static init(schemaPath: string): string;
    static filterIndexes(path: string): string;
    static filterNonKeywords(fragments: string[]): string[];
    static beautifiedLastFragment(schemaPath: string): string;
    static lastFragment(path: string): string;
    static beautify(text: string): string;
}

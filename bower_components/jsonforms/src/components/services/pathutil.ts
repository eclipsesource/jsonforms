import 'lodash';

export class PathUtil {

    private static Keywords: string[] = ['items', 'properties', '#'];
    private static joinWithSlash: (string) => string = _.partialRight(_.join, '/');
    private static numberRegex = /^\d+$/;

    /**
     * Converts a given schema path to its instance representation.
     *
     * @param schemaPath a schema path
     * @returns {string} the instance path
     */
    static normalize(schemaPath: string): string {
        return _.flow(PathUtil.normalizeFragments, PathUtil.joinWithSlash)(schemaPath);
    }

    /**
     * Converts a given schema path to its instance representation
     *
     * @param schemaPath a schema path
     * @returns {string[]} the instance path fragments array
     */
    static normalizeFragments(schemaPath: string): string[] {
        return _.flow(PathUtil.toPropertyFragments, PathUtil.filterNonKeywords)(schemaPath);
    }

    /**
     * Splits the given path, which is expected to be separated by slashes.
     *
     * @param path the path to be splitted
     * @returns {string[]} an array of fragments
     */
    static toPropertyFragments(path: string): string[] {
        if (path === undefined) {
            return [];
        }
        return  path.split('/').filter(fragment => fragment.length > 0);
    }

    /**
     * Creates a string with single quotes on properties for accessing a property based on
     * path fragments.
     *
     * @param propertyPath the path to
     * @return {string} the property access path
     */
    static toPropertyAccessString(propertyPath: string): string {
        if (propertyPath === null || propertyPath === undefined) {
            throw new Error('Property path must not be undefined.');
        }
        let fragments = PathUtil.toPropertyFragments(propertyPath);
        return fragments.reduce((propertyAccessString, fragment) =>
            `${propertyAccessString}['${fragment}']`
            , '');
    }


    /**
     * Gets all but the last fragments of the given path as a string.
     *
     * @param schemaPath the path from which to retrieve all but the last fragment
     * @returns {string} the path without the last fragment
     */
    static init(schemaPath: string): string {
        return '/' + _.flow(
                PathUtil.toPropertyFragments,
                _.initial,
                PathUtil.joinWithSlash)(schemaPath);
    }

    /**
     * Removes all array indices from an instance path
     *
     * @param path the instance path from which to remove indices
     * @returns {string} the filtered path without indices
     */
    static filterIndexes(path: string): string {
        return PathUtil.toPropertyFragments(path)
            .filter((fragment, index, fragments) =>
                !(fragment.match(PathUtil.numberRegex) && fragments[index - 1] === 'items')
            ).join('/');
    }

    /**
     * Removes all schema-specific fragments from the given path.
     *
     * @param fragments the path from which to filter out the schema specific fragment
     * @returns {string[]} a path without schema specific fragments
     */
    static filterNonKeywords(fragments: string[]): string[] {
        return fragments.filter(fragment => !_.includes(PathUtil.Keywords, fragment));
    }

    /**
     * Returns the last fragment of the given path in a beautified manner.
     *
     * @param schemaPath the path from which to extract the beautified fragment
     * @returns {any} the last fragment in a beautified manner
     */
    static beautifiedLastFragment(schemaPath: string): string  {
        return _.flow(PathUtil.lastFragment, PathUtil.beautify)(schemaPath);
    }

    /**
     * Returns the last fragment of the given path which is expected to be separated
     * by slashes.
     *
     * @param path the slash separated path
     * @returns {string} the last fragment of the path
     */
    static lastFragment(path: string): string {
        return path.substr(path.lastIndexOf('/') + 1);
    }

    /**
     * Beautifies given string by performing conversion to start case.
     * @param text the text to be beautified
     */
    static beautify(text: string): string { return _.startCase(text); };
}


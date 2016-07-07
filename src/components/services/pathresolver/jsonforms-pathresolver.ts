
import {PathUtil} from '../pathutil';
import {SchemaElement} from "../../../jsonschema";

export interface IPathResolver {
    toInstancePath(schemaPath: string): string;

    resolveUi(instance: any, uiPath: string): any;

    resolveInstance(instance: any, path: string): any;

    resolveSchema(schema: SchemaElement, schemaPath: string): SchemaElement;

    lastFragment(path: string): string;

    resolveToLastModel(instance: any, path: string): any;
}

export class PathResolver implements IPathResolver {

    private pathMapping: { [id: string]: string; } = {};

    toInstancePath(path: string): string {
        return PathUtil.normalize(path);
    }

    resolveUi(instance: any, uiPath: string): any {
        let p = uiPath + '/scope/$ref';
        if (this.pathMapping !== undefined && this.pathMapping.hasOwnProperty(p)) {
            p = this.pathMapping[p];
        }
        return this.resolveInstance(instance, p);
    }

    resolveInstance(instance: any, schemaPath: string): any {
        return this.innerResolveInstance(instance, schemaPath, false);
    };

    /**
     *
     * @param schema the schema to resolve the path against
     * @param path a schema path
     * @returns {T|*|*}
     */
    resolveSchema(schema: any, path: string): any {
        try {
            let fragments = PathUtil.toPropertyFragments(path);
            return fragments.reduce(function (subSchema, fragment) {
                if (fragment === '#') {
                    return subSchema;
                } else if (subSchema instanceof Array) {
                    return subSchema.map(function (item) {
                        return item[fragment];
                    });
                }
                return subSchema[fragment];
            }, schema);
        } catch (err) {
            return undefined;
        }
    };

    lastFragment(schemaPath: string): string {
        let fragments: string[] = PathUtil.normalizeFragments(schemaPath);
        return fragments[fragments.length - 1];
    }

    resolveToLastModel(instance: any, schemaPath: string): any {
        let fragments: string[] = PathUtil.normalizeFragments(schemaPath);
        let fragmentsToObject: string[] = fragments.slice(0, fragments.length - 1);
        return this.innerResolveInstance(instance, fragmentsToObject.join('/'), true);
    }

    private innerResolveInstance(instance: any, schemaPath: string, createMissing: boolean): any {
        let fragments = PathUtil.toPropertyFragments(this.toInstancePath(schemaPath));
        return fragments.reduce((currObj, fragment) => {
            if (currObj === undefined) {
                return undefined;
            }
            if (currObj instanceof Array) {
                return currObj.map(item => item[fragment]);
            }
            if (!currObj.hasOwnProperty(fragment) && createMissing) {
                currObj[fragment] = {};
            }
            return currObj[fragment];
        }, instance);
    };
}

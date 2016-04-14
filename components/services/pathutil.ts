///<reference path="../references.ts"/>

export class PathUtil {

    private static Keywords:string[] = ["items", "properties", "#"];

    static normalize = (path:string):string => {
        return PathUtil.filterNonKeywords(PathUtil.toPropertyFragments(path)).join("/");
    };

    static toPropertyFragments = (path:string):string[] => {
        if (path === undefined) {
            return [];
        }
        return path.split('/').filter(function (fragment) {
            return fragment.length > 0;
        })
    };

    /**
     * Creates a string with single quotes on properties for accessing a property based on path fragments
     * @param propertyPathFragments the
     */

    static toPropertyAccessString = (propertyPath: string):string => {
        if (propertyPath === undefined || propertyPath === null) {
            throw new Error("property path is not defined!");
        }
        var fragments = PathUtil.toPropertyFragments(propertyPath);
        return fragments.reduce((propertyAccessString, fragment)=>{
            return `${propertyAccessString}['${fragment}']`;
        },"");
    };

    static inits(schemaPath: string): string {
        var fragments = PathUtil.toPropertyFragments(schemaPath);
        return '/' + fragments.slice(0, fragments.length - 1).join('/');
    };

    static filterIndexes(path:string):string {
        return PathUtil.toPropertyFragments(path).filter(function (fragment, index, fragments) {
            return !(fragment.match("^[0-9]+$") && fragments[index - 1] == "items");
        }).join("/");
    }

    static filterNonKeywords = (fragments:string[]):string[] => {
        return fragments.filter(function (fragment) {
            return !(PathUtil.Keywords.indexOf(fragment) !== -1);
        });
    };

    static beautifiedLastFragment(schemaPath: string): string  {
        return PathUtil.beautify(PathUtil.capitalizeFirstLetter(PathUtil.lastFragment(schemaPath)));
    }

    static lastFragment(schemaPath: string): string {
        return schemaPath.substr(schemaPath.lastIndexOf('/') + 1, schemaPath.length)
    }

    private static capitalizeFirstLetter(string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    /**
     * Beautifies by performing the following steps (if applicable)
     * 1. split on uppercase letters
     * 2. transform uppercase letters to lowercase
     * 3. transform first letter uppercase
     */
    static beautify = (text: string): string => {
        if(text && text.length > 0){
            var textArray = text.split(/(?=[A-Z])/).map((x)=>{return x.toLowerCase()});
            textArray[0] = textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
            return textArray.join(' ');
        }
        return text;
    };

}


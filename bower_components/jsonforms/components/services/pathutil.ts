///<reference path="../references.ts"/>

module JSONForms {

    export class PathUtil {

        private static Keywords:string[] = ["items", "properties", "#"];

        static normalize = (path:string):string => {
            return PathUtil.filterNonKeywords(PathUtil.toPropertyFragments(path)).join("/");
        };

        static toPropertyFragments = (path:string):string[] => {
            return path.split('/').filter(function (fragment) {
                return fragment.length > 0;
            })
        };

        static inits(schemaPath: string): string {
            var fragments = PathUtil.toPropertyFragments(schemaPath);
            return '/' + fragments.slice(0, fragments.length - 1).join('/');
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
}

///<reference path="jsonforms-pathresolver.d.ts"/>
///<reference path="..\..\typings\angularjs\angular.d.ts"/>
///<reference path="..\utils\pathutil.ts"/>
module JSONForms {

    export class PathResolver implements IPathResolver {

        private pathMapping:{ [id: string]: string; } = {};
        static $inject = ["$compile"];
        // $compile can then be used as this.$compile
        constructor(private $compile:ng.ICompileService) {
        }

        addUiPathToSchemaRefMapping = (addition:any) => {
            for (var ref in addition) {
                if (addition.hasOwnProperty(ref)) {
                    this.pathMapping[ref] = addition[ref];
                }
            }
        };
        getSchemaRef = (uiSchemaPath:string):any => {

            if (uiSchemaPath == "#") {
                return "#";
            }

            return this.pathMapping[uiSchemaPath + "/scope/$ref"];
        };

        toInstancePath = (path:string):string => {
            return PathUtil.normalize(path);
        };

        resolveUi = (instance:any, uiPath:string):any => {
            var p = uiPath + "/scope/$ref";
            if (this.pathMapping !== undefined && this.pathMapping.hasOwnProperty(p)) {
                p = this.pathMapping[p];
            }
            return this.resolveInstance(instance, p);
        };


        resolveInstance = (instance:any, path:string):any => {
            var fragments = PathUtil.toPropertyFragments(this.toInstancePath(path));
            return fragments.reduce(function (currObj, fragment) {
                if (currObj instanceof Array) {
                    return currObj.map(function (item) {
                        return item[fragment];
                    });
                }
                return currObj[fragment];
            }, instance);
        };

        /**
         *
         * @param schema the schema to resolve the path against
         * @param path a schema path
         * @returns {T|*|*}
         */
        resolveSchema = (schema:any, path:string):any => {

            var fragments = PathUtil.toPropertyFragments(path);
            return fragments.reduce(function (subSchema, fragment) {
                if (fragment == "#") {
                    return subSchema
                } else if (subSchema instanceof Array) {
                    return subSchema.map(function (item) {
                        return item[fragment];
                    });
                }
                return subSchema[fragment];
            }, schema);
        };
    }
}

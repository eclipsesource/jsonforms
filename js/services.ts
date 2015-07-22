/// <reference path="../typings/angularjs/angular.d.ts"/>

module jsonforms.services {

    export class UISchemaElement {
        type: string;
        elements: UISchemaElement[];

        constructor(private json: any) {
          this.type = json['type'];
          this.elements = json['elements'];
        }
    }

    export interface IDataProvider {
        fetchData()
        fetchPage(page: number, size: number)
        setPageSize(size: number)
    }

    export interface IRenderService {
        register(renderer: IRenderer): void
        render(element:jsonforms.services.UISchemaElement, schema, instance, path, dataProvider);
    }

    export interface IRenderer {
        render(element: jsonforms.services.UISchemaElement, schema, instance, path: string, dataProvider): any
        isApplicable(element: jsonforms.services.UISchemaElement): boolean
        priority: number
    }

    export interface IReferenceResolver {
        addToMapping(addition:any): void

        get(uiSchemaPath:string): any

        normalize(path:string): string

        resolve(instance:any, path:string): any

        resolveModelPath(instance:any, path:string): any
    }

    export interface IUISchemaGenerator {
        generateDefaultUISchema(jsonSchema:any): any
    }

    // TODO: EXPORT
    export class RenderService {

        private renderers: IRenderer[] = []
        static $inject = ["$compile"];

        // $compile can then be used as this.$compile
        constructor(private $compile:ng.ICompileService) {
        }


        render = (element:jsonforms.services.UISchemaElement, schema, instance, path, dataProvider) => {

            var foundRenderer;

            for (var i = 0; i < this.renderers.length; i++) {
                if (this.renderers[i].isApplicable(element)) {
                    if (foundRenderer == undefined || this.renderers[i].priority > foundRenderer.priority) {
                        foundRenderer = this.renderers[i];
                    }
                }
            }

            if (foundRenderer === undefined) {
                throw new Error("No applicable renderer found for element " + JSON.stringify(element));
            }

            return foundRenderer.render(element, schema, instance, path, dataProvider);
        };
        register = (renderer:IRenderer) => {
            this.renderers.push(renderer);
        }
    }


    export class ReferenceResolver {

        private pathMapping:{ [id: string]: string; } = {};
        private Keywords:string[] = ["items", "properties", "#"];
        static $inject = ["$compile"];
        // $compile can then be used as this.$compile
        constructor(private $compile:ng.ICompileService) {
        }

        addToMapping = (addition:any) => {
            for (var ref in addition) {
                if (addition.hasOwnProperty(ref)) {
                    this.pathMapping[ref] = addition[ref];
                }
            }
        };
        get= (uiSchemaPath:string):any => {
            return this.pathMapping[uiSchemaPath + "/scope/$ref"];
        };

        normalize = (path:string):string => {
            return this.filterNonKeywords(this.toPropertyFragments(path)).join("/");
        };

        resolve = (instance:any, path:string):any => {
            var p = path + "/scope/$ref";
            if (this.pathMapping !== undefined && this.pathMapping.hasOwnProperty(p)) {
                p = this.pathMapping[p];
            }
            return this.resolveModelPath(instance, p);
        };

        resolveModelPath = (instance:any, path:string):any => {
            var fragments = this.toPropertyFragments(this.normalize(path));
            return fragments.reduce(function (currObj, fragment) {
                if (currObj instanceof Array) {
                    return currObj.map(function (item) {
                        return item[fragment];
                    });
                }
                return currObj[fragment];
            }, instance);
        };

        private toPropertyFragments = (path:string):string[] => {
            return path.split('/').filter(function (fragment) {
                return fragment.length > 0;
            })
        };

        private filterNonKeywords = (fragments:string[]):string[] => {
            var that = this;
            return fragments.filter(function (fragment) {
                return !(that.Keywords.indexOf(fragment) !== -1);
            });
        };

    }

    export class UISchemaGenerator{
        generateDefaultUISchema = (jsonSchema:any):any =>{
            var uiSchema = {
                type: "VerticalLayout",
                elements: []
            }
            for(var property in jsonSchema.properties){
                if(property === "id"){
                    //ignore id for now
                    continue;
                }
                var control = {
                    type: "Control",
                    label: property.charAt(0).toUpperCase() + property.slice(1),
                    scope: {
                        $ref: "#/properties/" + property
                    }
                }

                uiSchema.elements.push(control);
            }
            return uiSchema;
        };
    }


    export class RecursionHelper {

        static $inject = ["$compile"];
        // $compile can then be used as this.$compile
        constructor(private $compile:ng.ICompileService) {
        }

        compile = (element, link) => {

            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = {post: link};
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            var that = this;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function (scope, element) {

                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = that.$compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    }

}

angular.module('jsonForms.services', [])
    .service('RecursionHelper', jsonforms.services.RecursionHelper)
    .service('ReferenceResolver', jsonforms.services.ReferenceResolver)
    .service('RenderService', jsonforms.services.RenderService)
    .service('UISchemaGenerator', jsonforms.services.UISchemaGenerator);

/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/schemas/uischema.d.ts"/>

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
            var uiSchemaElements = [];
            this.generateUISchema(jsonSchema, uiSchemaElements, "#", "");

            console.log("generated schema: " + JSON.stringify(uiSchemaElements[0]))

            return uiSchemaElements[0];
        };

        private generateUISchema = (jsonSchema:any, schemaElements:IUISchemaElement[], currentRef:string, schemaName:string):any =>{
            if(!jsonSchema.type){
                throw new Error("No type found for JSON Schema element " + JSON.stringify(jsonSchema));
            }

            switch(jsonSchema.type) {

                case "object":
                    // Add a vertical layout with a label for the element name (if it exists)
                    var verticalLayout:IVerticalLayout = {
                        type: "VerticalLayout",
                        elements: []
                    };
                    schemaElements.push(verticalLayout);

                    if (schemaName && schemaName !== "") {
                        // add label with name
                        var label:ILabel = {
                            type: "Label",
                            text: this.beautify(schemaName)
                        };
                        verticalLayout.elements.push(label);
                    }

                    // traverse properties
                    if (!jsonSchema.properties) {
                        // If there are no properties return
                        return;
                    }

                    var nextRef:string = currentRef + '/' + "properties";
                    for (var property in jsonSchema.properties) {
                        if(property === "id"){
                            // could be a string (json-schema-id). Ignore in that case
                            if(typeof jsonSchema.properties[property] === "string"){
                                continue;
                            }
                        }
                        this.generateUISchema(jsonSchema.properties[property], verticalLayout.elements, nextRef + "/" + property, property);
                    }

                    break;

                case "array":

                    var horizontalLayout:IHorizontalLayout = {
                        type: "HorizontalLayout",
                        elements: []
                    };
                    schemaElements.push(horizontalLayout);

                    var nextRef:string = currentRef + '/' + "items";

                    if (!jsonSchema.items) {
                        // If there are no items ignore the element
                        return;
                    }

                    //check if items is object or array
                    if(jsonSchema.items instanceof Array){
                        for(var i=0; i<jsonSchema.items.length; i++){
                            this.generateUISchema(jsonSchema.items[i], horizontalLayout.elements, nextRef  + '[' + i + ']', "");
                        }
                    }else{
                        this.generateUISchema(jsonSchema.items, horizontalLayout.elements, nextRef, "");
                    }

                    break;

                case "string":
                case "number":
                case "integer":
                case "boolean":
                    var controlObject:IControlObject = this.getControlObject(this.beautify(schemaName), currentRef);
                    schemaElements.push(controlObject);
                    break;

                default:
                    throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
            }

        };

        private getControlObject = (label: string, ref: string): IControlObject =>{
            return {
                type: "Control",
                label: label,
                scope: {
                    $ref: ref
                }
            };
        };

        //1. split on uppercase letters
        //2. transform uppercase letters to lowercase
        //3. transform first letter uppercase
        private beautify = (text: string): string => {
            if(text && text.length > 0){
                var textArray = text.split(/(?=[A-Z])/).map((x)=>{return x.toLowerCase()});
                textArray[0] = textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
                text = textArray.join(' ');
            }
            return text;
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

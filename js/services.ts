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

    export interface ISchemaGenerator {
        generateDefaultSchema(instance: Object): Object
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

    export class SchemaGenerator {

        public generateDefaultSchema = (instance: Object) : any => {
            var schema = this.schemaObject(instance);
            console.log("generated default schema: " + JSON.stringify(schema));
            return schema;
        };

        private schemaObject = (instance: Object) : Object => {
            var properties = this.properties(instance);
            return {
                "type": "object",
                "properties": properties,
                "additionalProperties": this.allowAdditionalProperties(properties),
                "required": this.keys(this.requiredProperties(properties))
            };
        };

        private properties = (instance: Object) : Object => {
            var properties = {};
            var generator = this;
            this.keys(instance).forEach(function(property) {
                properties[property] = generator.property(instance[property])
            });
            return properties;
        };

        private keys = (properties: Object) : string[] => {
            return Object.keys(properties);
        };

        private property = (instance: any) : Object => {
            switch (typeof instance) {
                case "string":
                case "boolean":
                    return { "type": typeof instance };
                case "number":
                    if (Number(instance) % 1 === 0) {
                        return { "type": "integer" };
                    } else {
                        return { "type": "number" };
                    }
                case "object":
                    return this.schemaObjectOrNullOrArray(instance);
                default:
                    return {};
            }
        };

        private schemaObjectOrNullOrArray= (instance: Object): Object => {
            if (this.isNotNull(instance)) {
                if (this.isArray(instance)) {
                    return this.schemaArray(<Array<Object>>instance);
                } else {
                    return this.schemaObject(instance);
                }
            } else {
                return { "type": "null" };
            }
        };

        private schemaArray= (instance: Array<Object>): Object => {
            if ((instance).length) {
                return {
                    "type": "array",
                    "items": this.property(instance[0])
                };
            }
        };

        private isArray = (instance: any): boolean => {
            return Object.prototype.toString.call(instance) === '[object Array]';
        };

        private isNotNull = (instance: any): boolean => {
            return (typeof(instance) !== 'undefined') && (instance !== null);
        };

        protected requiredProperties = (properties: Object): Object => {
            return properties; // all properties are required by default
        };

        protected allowAdditionalProperties = (properties:Object): boolean => {
            return false; // restrict to known properties by default
        }

    }

    export class UISchemaGenerator{
        generateDefaultUISchema = (jsonSchema:any):any =>{
            var uiSchemaElements = [];
            this.generateUISchema(jsonSchema, uiSchemaElements, "#", "");

            console.log("generated ui schema: " + JSON.stringify(uiSchemaElements[0]))

            return uiSchemaElements[0];
        };

        private generateUISchema = (jsonSchema:any, schemaElements:IUISchemaElement[], currentRef:string, schemaName:string):any =>{
            var type = this.deriveType(jsonSchema);

            switch(type) {

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
                        if(this.isIgnoredProperty(property, jsonSchema.properties[property])){
                            continue;
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
                    if (jsonSchema.items instanceof Array) {
                        for (var i = 0; i < jsonSchema.items.length; i++) {
                            this.generateUISchema(jsonSchema.items[i], horizontalLayout.elements, nextRef + '[' + i + ']', "");
                        }
                    } else {
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
                case "null":
                    //ignore
                    break;
                default:
                    throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
            }

        };

        /**
         * Determines if the property should be ignored because it is a meta property
         */
        private isIgnoredProperty = (propertyKey: string, propertyValue: any): boolean => {
            // could be a string (json-schema-id). Ignore in that case
            return propertyKey === "id" && typeof propertyValue === "string";
            // TODO ignore all meta keywords
        }

        /**
         * Derives the type of the jsonSchema element
         */
        private deriveType = (jsonSchema: any): string => {
            if(jsonSchema.type){
                return jsonSchema.type;
            }
            if(jsonSchema.properties || jsonSchema.additionalProperties){
                return "object";
            }
            // ignore all remaining cases
            return "null";
        }

        /**
         * Creates a IControlObject with the given label referencing the given ref
         */
        private getControlObject = (label: string, ref: string): IControlObject =>{
            return {
                type: "Control",
                label: label,
                scope: {
                    $ref: ref
                }
            };
        };

        /**
         * Beautifies by performing the following steps (if applicable)
         * 1. split on uppercase letters
         * 2. transform uppercase letters to lowercase
         * 3. transform first letter uppercase
         */
        private beautify = (text: string): string => {
            if(text && text.length > 0){
                var textArray = text.split(/(?=[A-Z])/).map((x)=>{return x.toLowerCase()});
                textArray[0] = textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
                return textArray.join(' ');
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
    .service('SchemaGenerator', jsonforms.services.SchemaGenerator)
    .service('UISchemaGenerator', jsonforms.services.UISchemaGenerator);

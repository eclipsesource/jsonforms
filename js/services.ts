/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/schemas/uischema.d.ts"/>
/// <reference path="../typings/schemas/jsonschema.d.ts"/>

module JSONForms {

    var currentSchema: SchemaElement

    export class UISchemaElement {

        type: string;
        elements: UISchemaElement[];

        constructor(private json: any) {
          this.type = json['type'];
          this.elements = json['elements'];
        }
    }

    export interface IDataProvider {
        data: any
        fetchData(): ng.IPromise<any>
        fetchPage(page: number, size: number): ng.IPromise<any>
        setPageSize(size: number)
        pageSize: number
        page: number
        totalItems?: number
    }

    export class DefaultDataProvider implements  IDataProvider {

        private currentPage = 0;
        private currentPageSize = 2;

        constructor(private $q: ng.IQService,  public data: any) { }

        fetchData(): ng.IPromise<any> {
            var p = this.$q.defer();
            // TODO: validation missing
            p.resolve(this.data);
            return p.promise;
        }

        setPageSize = (newPageSize: number) => {
            this.currentPageSize = newPageSize
        };

        fetchPage = (page: number, size: number) => {
            this.currentPage = page;
            this.currentPageSize = size;
            var p = this.$q.defer();
            if (this.data instanceof Array) {
                p.resolve(
                    this.data.slice(this.currentPage * this.currentPageSize, this.currentPage * this.currentPageSize + this.currentPageSize));
            } else {
                p.resolve(this.data);
            }
            return p.promise;
        };

        totalItems = this.data.length;
        pageSize = this.currentPageSize
        page = this.currentPage
    }


    export interface IRenderService {
        registerSchema(schema: SchemaElement): void
        register(renderer: IRenderer): void
        render(element:JSONForms.UISchemaElement, dataProvider: JSONForms.IDataProvider);
    }

    export interface IRenderer {
        /**
         * When the RenderService's render method is called it gets passed the UI Schema element (e.g. a Control)
         * to be rendered and a so called DataProvider that is responsible for maintaining the data.
         * Then every registered renderer is checked whether it is able to render the current UI Schema element.
         * If multiple renderers are applicable, the one with the highest priority is selected and triggered.
         */
        render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): IRenderDescription
        isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean
        priority: number
    }

    export interface IRenderDescription {
        type: string
        template?: string
        templateUrl?: string
        size: number
    }

    export interface IControlRenderDescription extends IRenderDescription {
        instance: any
        path: string

        alerts: any[]
        validate(): boolean
    }

    export class ControlRenderDescription implements IControlRenderDescription {

        type = "Control";
        size = 99;
        alerts: any[] = []; // TODO IAlert type missing
        public label: string;
        public path: string;

        constructor(public instance: any, private schemaPath: string, label?: string) {
            this.path = PathUtil.normalize(schemaPath);
            var l;
            if (label) {
                l = label;
            } else {
                l = PathUtil.beautifiedLastFragment(schemaPath);
            }
            this.label = l;
        }

        validate(): boolean {
            if (tv4 == undefined) {
                return true;
            }
            var normalizedPath = '/' + PathUtil.normalize(this.schemaPath);
            var results = tv4.validateMultiple(this.instance, currentSchema);
            var errorMsg = undefined;

            for (var i = 0; i < results['errors'].length; i++) {

                var validationResult = results['errors'][i];

                if (validationResult.schemaPath.indexOf('/required') != -1) {
                    var propName = validationResult['params']['key'];
                    if (propName == normalizedPath.substr(normalizedPath.lastIndexOf('/') + 1, normalizedPath.length)) {
                        errorMsg = "Missing property";
                        break;
                    }
                }

                if (validationResult['dataPath'] == normalizedPath) {
                    errorMsg = validationResult.message;
                    break;
                }
            }

            if (errorMsg == undefined) {
                // TODO: perform required check
                this.alerts = [];
                return true;
            }

            this.alerts = [];
            var alert = {
                type: 'danger',
                msg: errorMsg
            };
            this.alerts.push(alert);

            return false;
        }

    }

    export interface IContainerRenderDescription extends IRenderDescription {
        elements: IRenderDescription[]
    }

    export interface IPathResolver {
        //addUiPathToSchemaRefMapping(addition:any): void

        //getSchemaRef(uiSchemaPath:string): any

        toInstancePath(schemaPath:string): string

        resolveUi(instance:any, uiPath:string): any

        resolveInstance(instance:any, path:string): any

        resolveSchema(schema: SchemaElement, schemaPath: string): SchemaElement
    }

    export interface ISchemaGenerator {
        generateDefaultSchema(instance: Object): Object
        generateDefaultSchemaWithOptions(instance: Object,
                                         allowAdditionalProperties: (properties:Object) => boolean,
                                         requiredProperties: (properties: string[]) => string[]) : Object
    }

    export interface IUISchemaGenerator {
        generateDefaultUISchema(jsonSchema:any): any
    }

    // TODO: EXPORT
    export class RenderService implements  IRenderService {

        private renderers: IRenderer[] = [];
        static $inject = ['PathResolver'];

        constructor(private refResolver: IPathResolver) {
        }


        registerSchema(schema: SchemaElement) {
            currentSchema = schema;
        }

        render = (element: IUISchemaElement, dataProvider: JSONForms.IDataProvider) => {

            var foundRenderer;
            var schemaPath;
            var subSchema;

            // TODO element must be IControl
            if (element['scope']) {
                schemaPath = element['scope']['$ref'];
                subSchema = this.refResolver.resolveSchema(currentSchema, schemaPath);
            }

            for (var i = 0; i < this.renderers.length; i++) {
                if (this.renderers[i].isApplicable(element, subSchema, schemaPath)) {
                    if (foundRenderer == undefined || this.renderers[i].priority > foundRenderer.priority) {
                        foundRenderer = this.renderers[i];
                    }
                }
            }

            if (foundRenderer === undefined) {
                throw new Error("No applicable renderer found for element " + JSON.stringify(element));
            }

            var resultObject = foundRenderer.render(element, currentSchema, schemaPath, dataProvider);
            if (resultObject.validate) {
                resultObject.validate();
            }
            return resultObject;
        };
        register = (renderer:IRenderer) => {
            this.renderers.push(renderer);
        }
    }

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

        static filterNonKeywords = (fragments:string[]):string[] => {
            return fragments.filter(function (fragment) {
                return !(PathUtil.Keywords.indexOf(fragment) !== -1);
            });
        };

        static beautifiedLastFragment(schemaPath: string): string  {
            return PathUtil.beautify(PathUtil.capitalizeFirstLetter(schemaPath.substr(schemaPath.lastIndexOf('/') + 1, schemaPath.length)));
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


        resolveInstance = (instance:any, schemaPath:string):any => {
            var fragments = PathUtil.toPropertyFragments(this.toInstancePath(schemaPath));
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
        resolveSchema = (schema: any, path: string): any => {

            var fragments = PathUtil.toPropertyFragments(path);
            return fragments.reduce(function (subSchema, fragment) {
                if (fragment == "#"){
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

    export class SchemaGenerator {

        public generateDefaultSchema = (instance: Object) : Object => {
            return this.schemaObject(instance, this.allowAdditionalProperties, this.requiredProperties);
        };

        public generateDefaultSchemaWithOptions = (instance: Object,
                                                   allowAdditionalProperties: (properties:Object) => boolean,
                                                   requiredProperties: (properties: string[]) =>  string[]) : Object => {
            return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
        };

        private schemaObject = (instance: Object,
                                allowAdditionalProperties: (properties:Object) => boolean,
                                requiredProperties: (properties: string[]) =>  string[]) : Object => {
            var properties = this.properties(instance, allowAdditionalProperties, requiredProperties);
            return {
                "type": "object",
                "properties": properties,
                "additionalProperties": allowAdditionalProperties(properties),
                "required": requiredProperties(this.keys(properties))
            };
        };

        private properties = (instance: Object,
                              allowAdditionalProperties: (properties:Object) => boolean,
                              requiredProperties: (properties: string[]) =>  string[]) : Object => {
            var properties = {};
            var generator = this;
            this.keys(instance).forEach(function(property) {
                properties[property] = generator.property(instance[property],
                    allowAdditionalProperties, requiredProperties);
            });
            return properties;
        };

        private keys = (properties: Object) : string[] => {
            return Object.keys(properties);
        };

        private property = (instance: Object,
                            allowAdditionalProperties: (properties:Object) => boolean,
                            requiredProperties: (properties: string[]) =>  string[]) : Object => {
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
                    return this.schemaObjectOrNullOrArray(instance, allowAdditionalProperties, requiredProperties);
                default:
                    return {};
            }
        };

        private schemaObjectOrNullOrArray= (instance: Object,
                                            allowAdditionalProperties: (properties:Object) => boolean,
                                            requiredProperties: (properties: string[]) =>  string[]): Object => {
            if (this.isNotNull(instance)) {
                if (this.isArray(instance)) {
                    return this.schemaArray(<Array<Object>>instance, allowAdditionalProperties, requiredProperties);
                } else {
                    return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
                }
            } else {
                return { "type": "null" };
            }
        };

        private schemaArray= (instance: Array<Object>,
                              allowAdditionalProperties: (properties:Object) => boolean,
                              requiredProperties: (properties: string[]) =>  string[]): Object => {
            if (instance.length) {
                var generator = this;
                var allProperties = instance.map(function(object) {
                    return generator.property(object, allowAdditionalProperties, requiredProperties);
                });
                var uniqueProperties = this.distinct(allProperties,
                    function(object) { return JSON.stringify(object) });
                if (uniqueProperties.length == 1) {
                    return {
                        "type": "array",
                        "items": uniqueProperties[0]
                    };
                } else {
                    return {
                        "type": "array",
                        "items": {
                            "oneOf": uniqueProperties
                        }
                    };
                }
            }
        };

        private isArray = (instance: any): boolean => {
            return Object.prototype.toString.call(instance) === '[object Array]';
        };

        private isNotNull = (instance: any): boolean => {
            return (typeof(instance) !== 'undefined') && (instance !== null);
        };

        private distinct = (array: Array<Object>, discriminator: (item: Object) => any): Array<Object> => {
            var known = {};
            return array.filter(function(item) {
                var discriminatorValue = discriminator(item);
                if (known.hasOwnProperty(discriminatorValue)) {
                    return false;
                } else {
                    return (known[discriminatorValue] = true);
                }
            });
        };

        protected requiredProperties = (properties: string[]): string[] => {
            return properties; // all known properties are required by default
        };

        protected allowAdditionalProperties = (properties:Object): boolean => {
            return true; // allow other properties by default
        }

    }

    export class UISchemaGenerator{
        generateDefaultUISchema = (jsonSchema:any):any =>{
            var uiSchemaElements = [];
            this.generateUISchema(jsonSchema, uiSchemaElements, "#", "");
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
                            text: PathUtil.beautify(schemaName)
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
                    var controlObject:IControlObject = this.getControlObject(PathUtil.beautify(schemaName), currentRef);
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
        };

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
        };

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
    }

    export class RenderDescriptionFactory {
        static createControlDescription(data: any, schemaPath: string, label?: string) {
            return new ControlRenderDescription(data, schemaPath, label);
        }
    }

    declare var tv4;
}

angular.module('jsonforms.services', [])
    .service('PathResolver', JSONForms.PathResolver)
    .service('RenderService', JSONForms.RenderService)
    .service('SchemaGenerator', JSONForms.SchemaGenerator)
    .service('UISchemaGenerator', JSONForms.UISchemaGenerator)
    .service('RenderDescriptionFactory', JSONForms.RenderDescriptionFactory);

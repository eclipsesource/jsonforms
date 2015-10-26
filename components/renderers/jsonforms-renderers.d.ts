///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="../../typings/schemas/jsonschema.d.ts"/>
///<reference path="../../typings/schemas/uischema.d.ts"/>
///<reference path="../utils/dataproviders.d.ts"/>

declare module JSONForms {
    export interface IRenderService {
        registerSchema(schema:SchemaElement): void
        register(renderer:IRenderer): void
        render(element:IUISchemaElement, dataProvider:JSONForms.IDataProvider);
    }

    export interface IRenderer {
        /**
         * When the RenderService's render method is called it gets passed the UI Schema element (e.g. a Control)
         * to be rendered and a so called DataProvider that is responsible for maintaining the data.
         * Then every registered renderer is checked whether it is able to render the current UI Schema element.
         * If multiple renderers are applicable, the one with the highest priority is selected and triggered.
         */
        render(element:IUISchemaElement, schema:SchemaElement, schemaPath:string, dataProvider:JSONForms.IDataProvider): IRenderDescription
        isApplicable(uiElement:IUISchemaElement, subSchema:SchemaElement, schemaPath:string): boolean
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

    export interface IRendererDescriptionFactory {
        createControlDescription(data: any, schemaPath: string, label?: string) : IRenderDescription;
    }

    export interface IContainerRenderDescription extends IRenderDescription {
        elements: IRenderDescription[]
    }
}

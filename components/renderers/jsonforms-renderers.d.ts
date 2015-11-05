///<reference path="../references.ts"/>

declare module JSONForms {
    export interface IRenderService {
        register(renderer: IRenderer): void
        render(scope: ng.IScope, element: IUISchemaElement, services: Services);
    }

    export interface IRenderer {
        render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: Services): IRenderDescription
        isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean
        priority: number
    }

    export interface IRenderDescription {
        type: string
        template?: string
        templateUrl?: string
        size: number
        rule?: IRule;
    }

    export interface IControlRenderDescription extends IRenderDescription {
        path: string

        alerts: any[]
        modelChanged(): void
    }

    export interface IRendererDescriptionFactory {

    }

    export interface IContainerRenderDescription extends IRenderDescription {
        elements: IRenderDescription[]
    }

    export interface IArrayControlRenderDescription extends JSONForms.IRenderDescription {
        gridOptions: uiGrid.IGridOptions
    }
}

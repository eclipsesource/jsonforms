/// <reference path="../../typings/ui-grid/ui-grid.d.ts"/>

interface WithLabel {
    label?: string
}

interface IUISchemaElement extends WithLabel {
    type: string;
}

//Layouts
interface ILayout extends IUISchemaElement{
    type: string;
    elements: IUISchemaElement[];
}
interface IVerticalLayout extends ILayout {

}
interface IHorizontalLayout extends ILayout {

}

//Control
interface IControlObject extends IUISchemaElement {
    scope: {
        $ref: string;
    }
}

// Array
interface IArrayControlObject extends IUISchemaElement {
    columns: IColumnControlObject[]
    options: uiGrid.IGridOptions
}

interface IColumnControlObject extends IControlObject {

}

//Label
interface ILabel extends IUISchemaElement {
    text: string;
}

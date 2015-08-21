interface IUISchemaElement{
    type: string;
}

//Layouts
interface ILayout extends IUISchemaElement{
    type: string;
    elements: IUISchemaElement[];
}
interface IVerticalLayout extends ILayout{

}
interface IHorizontalLayout extends ILayout{

}

//Control
interface IControlObject extends IUISchemaElement{
    label: string;
    scope: {
        $ref: string;
    }
}

//Label
interface ILabel extends IUISchemaElement{
    text: string;
}

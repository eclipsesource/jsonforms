/// <reference path="../../typings/ui-grid/ui-grid.d.ts"/>

//rule
interface IRule {
    effect: RuleEffect;
    condition:ICondition;
}
declare enum RuleEffect {
    HIDE,SHOW,ENABLE,DISABLE
}
interface ICondition {
    type:string; //nice to have
}
interface ILeafCondition extends ICondition {
    scope: {
        $ref: string;
    }
    expectedValue: any;
}

interface WithLabel {
    label?: string
}

interface IUISchemaElement extends WithLabel {
    type: string;
    rule?: IRule;
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
    readOnly?: boolean
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

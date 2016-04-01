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

interface IWithLabel {
    label?: string | boolean | ILabelObject
}

interface ILabelObject {
    text?: string
    show?: boolean
}

interface IUISchemaElement extends IWithLabel {
    type: string;
    rule?: IRule;
}

//Layouts
interface ILayout extends IUISchemaElement{
    type: string;
    elements: IUISchemaElement[];
}
interface IVerticalLayout extends ILayout { }
interface IHorizontalLayout extends ILayout { }
interface IGroup extends ILayout { }

//Control
interface IControlObject extends IUISchemaElement {
    scope: {
        $ref: string;
    }
    readOnly?: boolean
}

// Array
interface IArrayControlObject extends IControlObject {
    columns?: IColumnControlObject[]
    options?: any

}

interface IColumnControlObject extends IControlObject {

}

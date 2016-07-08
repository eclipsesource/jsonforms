export interface IRule {
    effect: RuleEffect;
    condition: ICondition;
}

export enum RuleEffect {
    HIDE = <any>'HIDE',
    SHOW = <any>'SHOW',
    ENABLE = <any>'ENABLE',
    DISABLE = <any>'DISABLE'
}

export interface ICondition {
    type: string; // nice to have
}

export interface ILeafCondition extends ICondition {
    scope: {
        $ref: string;
    };
    expectedValue: any;
}

export interface IWithLabel {
    label?: string | boolean | ILabelObject;
}

export interface ILabelObject {
    text?: string;
    show?: boolean;
}

export interface IUISchemaElement extends IWithLabel {
    type: string;
    rule?: IRule;
}

// Layouts
export interface ILayout extends IUISchemaElement {
    type: string;
    elements: IUISchemaElement[];
}
export interface IVerticalLayout extends ILayout { }
export interface IHorizontalLayout extends ILayout { }
export interface IGroup extends ILayout { }

// Control
export interface IControlObject extends IUISchemaElement {
    scope: {
        $ref: string;
    };
    readOnly?: boolean;
}

// Array
export interface IArrayControlObject extends IControlObject {
    columns?: IColumnControlObject[];
    options?: any;

}

export interface IColumnControlObject extends IControlObject {

}

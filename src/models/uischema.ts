export interface Rule {
    effect: RuleEffect;
    condition: Condition;
}
export enum RuleEffect {
    HIDE = <any>'HIDE',
    SHOW = <any>'SHOW',
    ENABLE = <any>'ENABLE',
    DISABLE = <any>'DISABLE'
}

export interface Condition {
    type: string; // TODO needed?
}
export interface LeafCondition extends Condition {
    scope: {
        $ref: string;
    };
    expectedValue: any;
}

export interface UISchemaElement {
  type: string;
  rule?: Rule;
  options?: any;
}
export interface Layout extends UISchemaElement {
  elements: Array<UISchemaElement>;
}
export interface VerticalLayout extends Layout {
}
export interface HorizontalLayout extends Layout {
}
export interface GroupLayout extends Layout {
  label?: string;
}
export interface ILabelObject {
    text?: string;
    show?: boolean;
}
export interface LabelElement extends UISchemaElement {
  text: string | boolean | ILabelObject;
}
export interface ControlElement extends UISchemaElement {
  label?: string | boolean | ILabelObject;
  scope: {
    $ref: string;
  };
}
export interface Category extends Layout {
  label: string;
}
export interface Categorization extends UISchemaElement {
  label: string;
  elements: Array<Category|Categorization>;
}

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
export interface ControlElement extends UISchemaElement {
  label: string;
  scope: {
    $ref: string;
  };
}

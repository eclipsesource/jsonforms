/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
/**
 * Interface for describing an UI schema element that is referencing
 * a subschema. The value of the scope must be a JSON Pointer.
 */
export interface Scopable {
  /**
   * The scope that determines to which part this element should be bound to.
   */
  scope: string;
}

/**
 * A rule that may be attached to any UI schema element.
 */
export interface Rule {
  /**
   * The effect of the rule
   */
  effect: RuleEffect;

  /**
   * The condition of the rule that must evaluate to true in order
   * to trigger the effect.
   */
  condition: Condition;
}

/**
 * The different rule effects.
 */
export enum RuleEffect {
  /**
   * Effect that hides the associated element.
   */
  HIDE = 'HIDE',
  /**
   * Effect that shows the associated element.
   */
  SHOW = 'SHOW',
  /**
   * Effect that enables the associated element.
   */
  ENABLE = 'ENABLE',
  /**
   * Effect that disables the associated element.
   */
  DISABLE = 'DISABLE'
}

/**
 * Represents a condition to be evaluated.
 */
export interface Condition {
  /**
   * The type of condition.
   */
  type: string;
}

/**
 * A leaf condition.
 */
export interface LeafCondition extends Condition, Scopable {

  type: 'LEAF';

  /**
   * The expected value when evaluating the condition
   */
  expectedValue: any;
}

/**
 * Common base interface for any UI schema element.
 */
export interface UISchemaElement {

    /**
     * The type of this UI schema element.
     */
    type: string;

    /**
     * An optional rule.
     */
    rule?: Rule;

    /**
     * Any additional options.
     */
    options?: any;
}

/**
 * Represents a layout element which can order its children
 * in a specific way.
 */
export interface Layout extends UISchemaElement {
  /**
   * The child elements of this layout.
   */
  elements: UISchemaElement[];
}

/**
 * A layout which orders its child elements vertically (i.e. from top to bottom).
 */
export interface VerticalLayout extends Layout {
  type: 'VerticalLayout';
}

/**
 * A layout which orders its children horizontally (i.e. from left to right).
 */
export interface HorizontalLayout extends Layout {
  type: 'HorizontalLayout';
}

/**
 * A group resembles a vertical layout, but additionally might have a label.
 * This layout is useful when grouping different elements by a certain criteria.
 */
export interface GroupLayout extends Layout {
  type: 'Group';
  /**
   * The label of this group layout.
   */
  label?: string;
}

/**
 * Represents an object that can be used to configure a label.
 */
export interface LabelDescription {
  /**
   * An optional text to be displayed.
   */
  text?: string;
  /**
   * Optional property that determines whether to show this label.
   */
  show?: boolean;
}

/**
 * A label element.
 */
export interface LabelElement extends UISchemaElement {
  type: 'Label';
  /**
   * The text of label.
   */
  text: string;
}

/**
 * A control element. The scope property of the control determines
 * to which part of the schema the control should be bound.
 */
export interface ControlElement extends UISchemaElement, Scopable {
  type: 'Control';
  /**
   * An optional label that will be associated with the control
   */
  label?: string | boolean | LabelDescription;
}

/**
 * The category layout.
 */
export interface Category extends Layout {
  type: 'Category';
  /**
   * The label associated with this category layout.
   */
  label: string;
}

/**
 * The categorization element, which may have children elements.
 * A child element may either be itself a Categorization or a Category, hence
 * the categorization element can be used to represent recursive structures like trees.
 */
export interface Categorization extends UISchemaElement {
  type: 'Categorization';
  /**
   * The label of this categorization.
   */
  label: string;
  /**
   * The child elements of this categorization which are either of type
   * {@link Category} or {@link Categorization}.
   */
  elements: (Category|Categorization)[];
}

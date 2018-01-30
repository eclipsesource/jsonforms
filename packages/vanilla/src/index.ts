import {
  DispatchPropsOfControl,
  StatePropsOfControl,
  StatePropsOfRenderer
} from '@jsonforms/core';

/**
 * Additional renderer props specific to vanilla renderers.
 */
export interface VanillaRendererProps {
  /**
   * Returns all classes associated with the given style.
   * @param {string} string the style name
   * @param args any additional args necessary to calculate the classes
   * @returns {string[]} array of class names
   */
  getStyle(string: string, ...args: any[]): string[];

  /**
   * Returns all classes associated with the given style as a single class name.
   * @param {string} string the style name
   * @param args any additional args necessary to calculate the classes
   * @returns {string[]} array of class names
   */
  getStyleAsClassName(string: string, ...args: any[]): string;
}

/**
 * Vanilla specific state-related control props.
 */
export interface VanillaControlStateProps extends StatePropsOfControl, VanillaRendererProps {
  classNames: {
    wrapper: string;
    input: string;
    label: string;
    description: string;
  };
}

/**
 * Vanilla specific control props.
 */
export interface VanillaControlProps extends VanillaControlStateProps, DispatchPropsOfControl {

}

/**
 * Vanilla specific layout props.
 */
export interface VanillaLayoutProps extends StatePropsOfRenderer, VanillaRendererProps {

}

export * from './complex';
export * from './controls';
export * from './layouts';
export * from './fields';

import * as _ from 'lodash';
import {
  ControlElement,
  convertToValidClassName,
} from '@jsonforms/core';
import { getStyle, getStyleAsClassName } from '../reducers';
import { VanillaControlStateProps, VanillaLayoutProps } from '../index';

/**
 * A style associates a name with a list of CSS class names.
 */
export interface StyleDef {
  name: string;
  classNames: string[] | ((args: any[]) => string[]);
}

/**
 * Add vanilla props to the return value of calling the given
 * mapStateToProps function.
 *
 * @param mapStateToProps existing mapStateToProps function
 * @returns {VanillaControlStateProps} vanilla-specific control props
 */
export const addVanillaControlProps = (mapStateToProps: (s, p) => any) =>
  (state, ownProps): VanillaControlStateProps => {

  const props = mapStateToProps(state, ownProps);
  const trim = props.uischema.options && props.uischema.options.trim;
  const controlElement = props.uischema as ControlElement;
  const isValid = _.isEmpty(props.errors);
  const styles = getStyle(state)('control');
  let classNames: string[] = !_.isEmpty(controlElement.scope) ?
    styles.concat(
      [`${convertToValidClassName(controlElement.scope)}`]
    ) : [''];

  if (trim) {
    classNames = classNames.concat(getStyle(state)('control.trim'));
  }
  const labelClass = getStyleAsClassName(state)('control.label');
  const descriptionClassName = getStyleAsClassName(state)('input.description');
  const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

  return {
    ...props,
    getStyleAsClassName:  getStyleAsClassName(state),
    getStyle:  getStyle(state),
    classNames: {
      wrapper: classNames.join(' '),
      input: inputClassName.join(' '),
      label: labelClass,
      description: descriptionClassName
    },
  };
};

/**
 * Add vanilla props to the return value of calling the given
 * mapStateToProps function.
 *
 * @param mapStateToProps an existing mapStateToProps function for retrieving layout props
 * @returns {VanillaLayoutProps} vanilla specific layout props
 */
export const addVanillaLayoutProps = (mapStateToProps: (s, p) => any) =>
  (state, ownProps): VanillaLayoutProps => {

  const props = mapStateToProps(state, ownProps);

  return {
    ...props,
    getStyleAsClassName:  getStyleAsClassName(state),
    getStyle:  getStyle(state),
  };
};

/**
 * Pre-defined vanilla styles.
 *
 * @type {{name: string; classNames: string[]}[]}
 */
export const vanillaStyles = [
  {
    name: 'control',
    classNames: ['control']
  },
  {
    name: 'control.trim',
    classNames: ['trim']
  },
  {
    name: 'control.input',
    classNames: ['input']
  },
  {
    name: 'control.validation',
    classNames: ['validation']
  },
  {
    name: 'categorization',
    classNames: ['categorization']
  },
  {
    name: 'categorization.master',
    classNames: ['categorization-master']
  },
  {
    name: 'categorization.detail',
    classNames: ['categorization-detail']
  },
  {
    name: 'category.group',
    classNames: ['category-group']
  },
  {
    name: 'array.layout',
    classNames: ['array-layout']
  },
  {
    name: 'array.children',
    classNames: ['children']
  },
  {
    name: 'group.layout',
    classNames: ['group-layout']
  },
  {
    name: 'horizontal.layout',
    classNames: ['horizontal-layout']
  },
  {
    name: 'vertical.layout',
    classNames: ['vertical-layout']
  },
  {
    name: 'array.table',
    classNames: ['array-table-layout', 'control']
  },
  {
    name: 'input.description',
    classNames: ['input-description']
  }
];

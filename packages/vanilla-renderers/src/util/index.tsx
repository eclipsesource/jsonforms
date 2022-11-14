/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
export * from './i18nDefaults';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  ControlElement,
  convertToValidClassName,
  getConfig,
  JsonFormsState,
  OwnPropsOfCell,
  OwnPropsOfControl,
  OwnPropsOfRenderer,
  RendererProps,
  StatePropsOfCell,
  StatePropsOfControl
} from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';
import { getStyle, getStyleAsClassName } from '../reducers';
import { VanillaRendererProps } from '../index';
import { ComponentType, useMemo } from 'react';
import { findStyle, findStyleAsClassName } from '../reducers/styling';
import { useStyles } from '../styles';

/**
 * Add vanilla props to the return value of calling the given
 * mapStateToProps function.
 *
 * @param mapStateToProps existing mapStateToProps function
 * @returns {VanillaControlStateProps} vanilla-specific control props
 */
export const addVanillaControlProps = <P extends StatePropsOfControl>(
  mapStateToProps: (s: JsonFormsState, p: OwnPropsOfControl) => P
) => (
  state: JsonFormsState,
  ownProps: OwnPropsOfControl
): StatePropsOfControl & VanillaRendererProps => {
    const props: StatePropsOfControl = mapStateToProps(state, ownProps);
    const config = getConfig(state);
    const trim = config.trim;
    const controlElement = props.uischema as ControlElement;
    const isValid = isEmpty(props.errors);
    const styles = getStyle(state)('control');
    let classNames: string[] = !isEmpty(controlElement.scope)
      ? styles.concat([`${convertToValidClassName(controlElement.scope)}`])
      : [''];

    if (trim) {
      classNames = classNames.concat(getStyle(state)('control.trim'));
    }
    const labelClass = getStyleAsClassName(state)('control.label');
    const descriptionClassName = getStyleAsClassName(state)('input.description');
    const validationClassName = getStyleAsClassName(state)('control.validation');
    const validationErrorClassName = getStyleAsClassName(state)('control.validation.error');
    const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

    return {
      ...props,
      getStyleAsClassName: getStyleAsClassName(state),
      getStyle: getStyle(state),
      classNames: {
        wrapper: classNames.join(' '),
        input: inputClassName.join(' '),
        label: labelClass,
        description: descriptionClassName,
        validation: validationClassName,
        validationError: validationErrorClassName
      }
    };
  };

export const withVanillaControlProps = (Component: ComponentType<any>) => (props: any) => {
  const ctx = useJsonForms();
  const contextStyles = useStyles();
  const controlElement = props.uischema as ControlElement;
  const config = ctx.config;
  const trim = config && config.trim;
  const styles = useMemo(() => findStyle(contextStyles)('control'), [contextStyles]);
  let classNames: string[] = !isEmpty(controlElement.scope)
    ? styles.concat([`${convertToValidClassName(controlElement.scope)}`])
    : [''];

  if (trim) {
    classNames = classNames.concat(findStyle(contextStyles)('control.trim'));
  }
  const isValid = isEmpty(props.errors);
  const labelClass = useMemo(() => findStyleAsClassName(contextStyles)('control.label'), [contextStyles]);
  const descriptionClassName = useMemo(() => findStyleAsClassName(contextStyles)('input.description'), [contextStyles]);
  const validationClassName = useMemo(() => findStyleAsClassName(contextStyles)('control.validation'), [contextStyles]);
  const validationErrorClassName = useMemo(() => findStyleAsClassName(contextStyles)('control.validation.error'), [contextStyles]);
  const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

  const getStyleAsClassName = useMemo(() => findStyleAsClassName(contextStyles), [contextStyles]);
  const getStyle = useMemo(() => findStyle(contextStyles), [contextStyles]);

  const wrapper = classNames.join(' ');
  const input = inputClassName.join(' ');

  const classNamesProp = useMemo(() => ({
    wrapper,
    input,
    label: labelClass,
    description: descriptionClassName,
    validation: validationClassName,
    validationError: validationErrorClassName
  }), [wrapper, input, labelClass, descriptionClassName, validationClassName, validationErrorClassName]);

  return (
    <Component
      {...props}
      getStyleAsClassName={getStyleAsClassName}
      getStyle={getStyle}
      classNames={classNamesProp}
    />
  );
}

/**
 * Add vanilla props to the return value of calling the given
 * mapStateToProps function.
 *
 * @param mapStateToProps an existing mapStateToProps function for retrieving layout props
 * @returns {VanillaLayoutProps} vanilla specific layout props
 */
export const addVanillaLayoutProps = (
  mapStateToProps: (s: JsonFormsState, p: OwnPropsOfRenderer) => RendererProps
) => (
  state: JsonFormsState,
  ownProps: OwnPropsOfRenderer
): RendererProps & VanillaRendererProps => {
    const props = mapStateToProps(state, ownProps);

    return {
      ...props,
      getStyleAsClassName: getStyleAsClassName(state),
      getStyle: getStyle(state)
    };
  };

export const addVanillaCellProps = (
  mapStateToCellsProps: (
    s: JsonFormsState,
    p: OwnPropsOfCell
  ) => StatePropsOfCell
) => (
  state: JsonFormsState,
  ownProps: OwnPropsOfCell
): StatePropsOfCell & VanillaRendererProps => {
    const props = mapStateToCellsProps(state, ownProps);
    const inputClassName = ['validate'].concat(
      props.isValid ? 'valid' : 'invalid'
    );
    return {
      ...props,
      className: inputClassName.join(' '),
      getStyleAsClassName: getStyleAsClassName(state),
      getStyle: getStyle(state)
    };
  };

const withVanillaCellPropsForType = (type: string) => (
  Component: ComponentType<any>
) => (props: any) => {
  const inputClassName = ['validate'].concat(
    props.isValid ? 'valid' : 'invalid'
  );
  const styles = useStyles();
  const definedStyle = findStyleAsClassName(styles)(type);
  if (definedStyle) {
    inputClassName.push(definedStyle);
  }

  return (
    <Component
      {...props}
      getStyleAsClassName={findStyleAsClassName(styles)}
      getStyle={findStyle(styles)}
      className={inputClassName.join(' ')}
    />
  );
};

export const withVanillaCellProps = withVanillaCellPropsForType(
  'control.input'
);

export const withVanillaEnumCellProps = withVanillaCellPropsForType(
  'control.select'
);

export const withVanillaBooleanCellProps = withVanillaCellPropsForType(
  'control.checkbox'
);


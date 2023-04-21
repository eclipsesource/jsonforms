/*
  The MIT License

  Copyright (c) 2017-2021 EclipseSource Munich
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
import React, { useMemo, useState } from 'react';
import {
  computeLabel,
  ControlProps,
  isDescriptionHidden,
  OwnPropsOfEnum,
} from '@jsonforms/core';
import type { VanillaRendererProps } from '../index';
import { findStyleAsClassName } from '../reducers/styling';
import { useStyles } from '../styles';
import merge from 'lodash/merge';

export const RadioGroup = ({
  classNames,
  id,
  label,
  options,
  required,
  description,
  errors,
  data,
  uischema,
  visible,
  config,
  enabled,
  path,
  handleChange,
}: ControlProps & VanillaRendererProps & OwnPropsOfEnum) => {
  const contextStyles = useStyles();
  const [isFocused, setFocus] = useState(false);
  const radioControl = useMemo(
    () => findStyleAsClassName(contextStyles)('control.radio'),
    [contextStyles]
  );
  const radioOption = useMemo(
    () => findStyleAsClassName(contextStyles)('control.radio.option'),
    [contextStyles]
  );
  const radioInput = useMemo(
    () => findStyleAsClassName(contextStyles)('control.radio.input'),
    [contextStyles]
  );
  const radioLabel = useMemo(
    () => findStyleAsClassName(contextStyles)('control.radio.label'),
    [contextStyles]
  );
  const isValid = errors.length === 0;
  const divClassNames = [classNames.validation]
    .concat(isValid ? classNames.description : classNames.validationError)
    .join(' ');
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    isFocused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );
  const hasRadioClass = !radioControl || radioControl === 'radio';
  let groupStyle: { [x: string]: any } = {};
  if (hasRadioClass) {
    groupStyle = {
      display: 'flex',
      flexDirection:
        'vertical' === appliedUiSchemaOptions.orientation ? 'column' : 'row',
    };
  }
  return (
    <div
      className={classNames.wrapper}
      hidden={!visible}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <label htmlFor={id} className={classNames.label}>
        {computeLabel(
          label,
          required,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
      </label>
      <div className={radioControl} style={groupStyle}>
        {options.map((option) => (
          <div key={option.label} className={radioOption}>
            <input
              type='radio'
              value={option.value}
              id={option.value}
              name={id}
              checked={data === option.value}
              onChange={(ev) => handleChange(path, ev.currentTarget.value)}
              disabled={!enabled}
              className={radioInput}
            />
            <label htmlFor={option.value} className={radioLabel}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div className={divClassNames}>
        {!isValid ? errors : showDescription ? description : null}
      </div>
    </div>
  );
};

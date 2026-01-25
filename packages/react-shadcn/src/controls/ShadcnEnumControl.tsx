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

import React, { useMemo } from 'react';
import {
  ControlProps,
  isEnumControl,
  OwnPropsOfEnum,
  rankWith,
} from '@jsonforms/core';
import {
  TranslateProps,
  withJsonFormsEnumProps,
  withTranslateProps,
} from '@jsonforms/react';
import {
  NativeSelect,
  NativeSelectOption,
} from '../shadcn/components/ui/native-select';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from '../shadcn/components/ui/field';
import { cn } from '../shadcn/lib/utils';
import { useShadcnStyles } from '../styles/styleContext';
import { i18nDefaults } from '../util';

export const ShadcnEnumControl = (
  props: ControlProps & OwnPropsOfEnum & TranslateProps
) => {
  const {
    data,
    path,
    handleChange,
    label,
    errors,
    enabled,
    visible,
    description,
    required,
    id,
    schema,
    uischema,
    options,
    t,
  } = props;

  const styleOverrides = useShadcnStyles();

  if (!visible) {
    return null;
  }

  const hasErrors = errors && errors.length > 0;
  const showDescription = description && !hasErrors;

  // Convert JSON Forms error string to FieldError format
  const errorArray = hasErrors
    ? [{ message: errors }]
    : undefined;

  const noneOptionLabel = useMemo(
    () => t('enum.none', i18nDefaults['enum.none'], { schema, uischema, path }),
    [t, schema, uischema, path]
  );

  return (
    <Field
      data-invalid={hasErrors}
      orientation="vertical"
      className={cn(styleOverrides?.wrapperClasses)}
    >
      <FieldContent>
        {label && (
          <FieldLabel
            htmlFor={id}
            className={cn(
              required && 'after:content-["*"] after:ml-0.5 after:text-destructive',
              styleOverrides?.labelClasses
            )}
          >
            {label}
          </FieldLabel>
        )}
        <NativeSelect
          id={id}
          value={data !== undefined ? String(data) : ''}
          onChange={(e) => handleChange(path, e.target.value === '' ? undefined : e.target.value)}
          disabled={!enabled}
          aria-invalid={hasErrors}
          className={cn(
            'w-full',
            styleOverrides?.inputClasses
          )}
        >
          <NativeSelectOption value="">{noneOptionLabel}</NativeSelectOption>
          {options.map((option) => (
            <NativeSelectOption key={option.value} value={String(option.value)}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {showDescription && (
          <FieldDescription
            className={cn(styleOverrides?.descriptionClasses)}
          >
            {description}
          </FieldDescription>
        )}
        {hasErrors && (
          <FieldError
            errors={errorArray}
            className={cn(styleOverrides?.errorClasses)}
          />
        )}
      </FieldContent>
    </Field>
  );
};

/**
 * Tester for ShadcnEnumControl.
 * Matches enum controls.
 */
export const shadcnEnumControlTester = rankWith(2, isEnumControl);

export default withJsonFormsEnumProps(
  withTranslateProps(ShadcnEnumControl)
);

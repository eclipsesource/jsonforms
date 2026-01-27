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

import React from 'react';
import { ControlProps, OwnPropsOfEnum } from '@jsonforms/core';
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem,
} from '../shadcn/components/ui/radio-group';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from '../shadcn/components/ui/field';
import { Label } from '../shadcn/components/ui/label';
import { cn } from '../shadcn/lib/utils';
import { useShadcnStyles } from '../styles/styleContext';
import merge from 'lodash/merge';

export const RadioGroup = (props: ControlProps & OwnPropsOfEnum) => {
  const {
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
  } = props;

  const styleOverrides = useShadcnStyles();

  if (!visible) {
    return null;
  }

  const hasErrors = errors && errors.length > 0;
  const showDescription = description && !hasErrors;

  // Convert JSON Forms error string to FieldError format
  const errorArray = hasErrors ? [{ message: errors }] : undefined;

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const orientation = appliedUiSchemaOptions.orientation || 'vertical';

  return (
    <Field
      data-invalid={hasErrors}
      orientation="vertical"
      className={cn(styleOverrides?.wrapperClasses)}
    >
      <FieldContent>
        {label && (
          <FieldLabel
            className={cn(
              required && 'after:content-["*"] after:ml-0.5 after:text-destructive',
              styleOverrides?.labelClasses
            )}
          >
            {label}
          </FieldLabel>
        )}
        <ShadcnRadioGroup
          value={data !== undefined ? String(data) : undefined}
          onValueChange={(value) => handleChange(path, value)}
          disabled={!enabled}
          className={cn(
            orientation === 'horizontal' && 'flex-row',
            styleOverrides?.inputClasses
          )}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.value)}
                id={`${id}-${option.value}`}
                aria-invalid={hasErrors}
              />
              <Label
                htmlFor={`${id}-${option.value}`}
                className="font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </ShadcnRadioGroup>
        {showDescription && (
          <FieldDescription className={cn(styleOverrides?.descriptionClasses)}>
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

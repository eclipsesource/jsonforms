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

import React from 'react';
import {
  ControlProps,
  isControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import {
  DispatchCell,
  withJsonFormsControlProps,
} from '@jsonforms/react';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from '../shadcn/components/ui/field';
import { cn } from '../shadcn/lib/utils';
import { useShadcnStyles } from '../styles/styleContext';

/**
 * Generic fallback input control that uses DispatchCell to render the appropriate cell.
 * This control catches any control that doesn't have a more specific renderer.
 */
export const InputControl = (props: ControlProps) => {
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    required,
    path,
    enabled,
    schema,
  } = props;

  const styleOverrides = useShadcnStyles();

  if (!visible) {
    return null;
  }

  const hasErrors = errors && errors.length > 0;
  const showDescription = description && !hasErrors;

  // Convert JSON Forms error string to FieldError format
  const errorArray = hasErrors ? [{ message: errors }] : undefined;

  return (
    <Field
      data-invalid={hasErrors}
      orientation="vertical"
      className={cn(styleOverrides?.wrapperClasses)}
    >
      <FieldContent>
        {label && (
          <FieldLabel
            htmlFor={id + '-input'}
            className={cn(
              required && 'after:content-["*"] after:ml-0.5 after:text-destructive',
              styleOverrides?.labelClasses
            )}
          >
            {label}
          </FieldLabel>
        )}
        <DispatchCell
          uischema={uischema}
          schema={schema}
          path={path}
          id={id + '-input'}
          enabled={enabled}
        />
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

/**
 * Fallback tester that matches any control.
 * Use rank 1 so that more specific controls can override this.
 */
export const inputControlTester: RankedTester = rankWith(1, isControl);

export default withJsonFormsControlProps(InputControl);

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
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  ControlProps,
  isBooleanControl,
  rankWith,
} from '@jsonforms/core';
import { Checkbox } from '../shadcn/components/ui/checkbox';
import { Label } from '../shadcn/components/ui/label';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldContent,
} from '../shadcn/components/ui/field';
import { cn } from '../shadcn/lib/utils';
import { useShadcnStyles } from '../styles/styleContext';

export const ShadcnBooleanControl = (props: ControlProps) => {
  const {
    data,
    path,
    handleChange,
    label,
    errors,
    enabled,
    visible,
    description,
    id,
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

  return (
    <Field
      data-invalid={hasErrors}
      orientation="horizontal"
      className={cn(styleOverrides?.wrapperClasses)}
    >
      <FieldContent>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={id}
            checked={!!data}
            onCheckedChange={(checked: boolean) => handleChange(path, checked)}
            disabled={!enabled}
            className={cn(
              hasErrors && 'border-destructive',
              styleOverrides?.inputClasses
            )}
          />
          {label && (
            <Label
              htmlFor={id}
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                styleOverrides?.labelClasses
              )}
            >
              {label}
            </Label>
          )}
        </div>
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
 * Tester for ShadcnBooleanControl.
 * Matches boolean controls.
 */
export const shadcnBooleanControlTester = rankWith(2, isBooleanControl);

export default withJsonFormsControlProps(ShadcnBooleanControl);

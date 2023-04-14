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
  CellProps,
  isStringControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import type { VanillaRendererProps } from '../index';
import { withVanillaCellProps } from '../util/index';
import merge from 'lodash/merge';

export const TextCell = (props: CellProps & VanillaRendererProps) => {
  const {
    config,
    data,
    className,
    id,
    enabled,
    uischema,
    schema,
    path,
    handleChange,
  } = props;
  const maxLength = schema.maxLength;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  return (
    <input
      type='text'
      value={data || ''}
      onChange={(ev) =>
        handleChange(path, ev.target.value === '' ? undefined : ev.target.value)
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
      maxLength={appliedUiSchemaOptions.restrict ? maxLength : undefined}
      size={appliedUiSchemaOptions.trim ? maxLength : undefined}
    />
  );
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textCellTester: RankedTester = rankWith(1, isStringControl);

export default withJsonFormsCellProps(withVanillaCellProps(TextCell));

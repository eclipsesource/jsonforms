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
  EnumCellProps,
  isOneOfEnumControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import {
  TranslateProps,
  withJsonFormsOneOfEnumCellProps,
  withTranslateProps,
} from '@jsonforms/react';
import { i18nDefaults, withVanillaEnumCellProps } from '../util';
import type { VanillaRendererProps } from '../index';

export const OneOfEnumCell = (
  props: EnumCellProps & VanillaRendererProps & TranslateProps
) => {
  const {
    data,
    className,
    id,
    enabled,
    schema,
    uischema,
    path,
    handleChange,
    options,
    t,
  } = props;
  const noneOptionLabel = useMemo(
    () => t('enum.none', i18nDefaults['enum.none'], { schema, uischema, path }),
    [t, schema, uischema, path]
  );
  const noneOption = (
    <option value={''} key={'jsonforms.enum.none'}>
      {noneOptionLabel}
    </option>
  );
  return (
    <select
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      value={data || ''}
      onChange={(ev) =>
        handleChange(
          path,
          ev.target.selectedIndex === 0 ? undefined : ev.target.value
        )
      }
    >
      {(uischema.options?.hideEmptyOption === true ? [] : [noneOption]).concat(
        options.map((optionValue) => (
          <option
            value={optionValue.value}
            label={optionValue.label}
            key={optionValue.value}
          />
        ))
      )}
    </select>
  );
};
/**
 * Default tester for oneOf enum controls.
 * @type {RankedTester}
 */
export const oneOfEnumCellTester: RankedTester = rankWith(
  2,
  isOneOfEnumControl
);

export default withJsonFormsOneOfEnumCellProps(
  withTranslateProps(withVanillaEnumCellProps(OneOfEnumCell))
);

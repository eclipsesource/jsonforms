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
  isRangeControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import type { VanillaRendererProps } from '../index';
import { withVanillaCellProps } from '../util/index';

export const SliderCell = (props: CellProps & VanillaRendererProps) => {
  const { data, className, id, enabled, uischema, schema, path, handleChange } =
    props;

  return (
    <div style={{ display: 'flex' }}>
      <input
        type='range'
        max={schema.maximum}
        min={schema.minimum}
        value={data || schema.default}
        onChange={(ev) => handleChange(path, Number(ev.target.value))}
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        style={{ flex: '1' }}
      />
      <label style={{ marginLeft: '0.5em' }}>{data || schema.default}</label>
    </div>
  );
};

export const sliderCellTester: RankedTester = rankWith(4, isRangeControl);

export default withJsonFormsCellProps(withVanillaCellProps(SliderCell));

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
import { Slider } from '../shadcn/components/ui/slider';
import { cn } from '../shadcn/lib/utils';
import { withShadcnCellProps } from '../util/props';
import type { ShadcnRendererProps } from '../util/props';

export const SliderCell = (props: CellProps & ShadcnRendererProps) => {
  const { data, id, enabled, schema, path, handleChange, styleOverrides } =
    props;

  const currentValue = data ?? schema.default ?? schema.minimum ?? 0;

  return (
    <div
      className={cn('flex items-center gap-3', styleOverrides?.inputClasses)}
    >
      <Slider
        id={id}
        value={[currentValue]}
        onValueChange={(values) => handleChange(path, values[0])}
        min={schema.minimum}
        max={schema.maximum}
        disabled={!enabled}
        className='flex-1'
      />
      <span className='text-sm font-medium min-w-[3ch] text-right'>
        {currentValue}
      </span>
    </div>
  );
};

export const sliderCellTester: RankedTester = rankWith(4, isRangeControl);

export default withJsonFormsCellProps(withShadcnCellProps(SliderCell));

/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import { SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import {
    FieldProps,
    isRangeControl,
    mapDispatchToFieldProps,
    mapStateToFieldProps,
    RankedTester,
    rankWith,
} from '@jsonforms/core';
import { VanillaRendererProps } from '../index';

export const SliderField = (props: FieldProps & VanillaRendererProps) => {
  const { data, className, id, enabled, uischema, scopedSchema, path, handleChange } = props;

  return (
  <div style={{display: 'flex'}}>
    <input
      type='range'
      max={scopedSchema.maximum}
      min={scopedSchema.minimum}
      value={data || scopedSchema.default}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, Number(ev.currentTarget.value))
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      style={{flex: '1'}}
    />
    <label style={{marginLeft: '0.5em'}}>{data || scopedSchema.default}</label>
  </div>
  );
};

export const sliderFieldTester: RankedTester = rankWith(4, isRangeControl);

export default connect(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(SliderField);

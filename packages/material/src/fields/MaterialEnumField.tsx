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
import {
    defaultMapDispatchToControlProps,
    defaultMapStateToEnumFieldProps,
    EnumFieldProps,
    isEnumControl,
    RankedTester,
    rankWith,
    WithClassname,
} from '@jsonforms/core';

import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';

export const MaterialEnumField = (props: EnumFieldProps & WithClassname) => {
  const { data, className, id, enabled, uischema, path, handleChange, options } = props;

  return (
    <Select
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      value={data || ''}
      onChange={ev => handleChange(path, ev.target.value)}
      fullWidth={true}
    >
      {
        [<MenuItem value='' key={'empty'} />]
          .concat(
            options.map(optionValue =>
              (
                <MenuItem value={optionValue} key={optionValue}>
                  {optionValue}
                </MenuItem>
              )
            )
          )}
    </Select>
  );
};
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const materialEnumFieldTester: RankedTester = rankWith(2, isEnumControl);
export default connect(
  defaultMapStateToEnumFieldProps,
  defaultMapDispatchToControlProps
)(MaterialEnumField);

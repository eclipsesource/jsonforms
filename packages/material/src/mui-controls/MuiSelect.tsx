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
import { EnumCellProps, WithClassname } from '@jsonforms/core';

import { MenuItem, Select } from '@mui/material';
import merge from 'lodash/merge';

export const MuiSelect = React.memo((props: EnumCellProps & WithClassname) => {
  const {
    data,
    className,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    options,
    config
  } = props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <Select
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      value={data !== undefined ? data : ''}
      onChange={ev => handleChange(path, ev.target.value)}
      fullWidth={true}
      variant={'standard'}
    >
      {[<MenuItem value='' key={'empty'} />].concat(
        options.map(optionValue => (
          <MenuItem value={optionValue.value} key={optionValue.value}>
            {optionValue.label}
          </MenuItem>
        ))
      )}
    </Select>
  );
});

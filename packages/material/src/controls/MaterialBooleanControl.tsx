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
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {
  isBooleanControl,
  RankedTester,
  rankWith,
  ControlProps
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormControlLabel, Hidden } from '@mui/material';
import { MuiCheckbox } from '../mui-controls/MuiCheckbox';

export const MaterialBooleanControl = ({
  data,
  visible,
  label,
  id,
  enabled,
  uischema,
  schema,
  rootSchema,
  handleChange,
  errors,
  path,
  config
}: ControlProps) => {
  return (
    <Hidden xsUp={!visible}>
      <FormControlLabel
        label={label}
        id={id}
        control={
          <MuiCheckbox
            id={`${id}-input`}
            isValid={isEmpty(errors)}
            data={data}
            enabled={enabled}
            visible={visible}
            path={path}
            uischema={uischema}
            schema={schema}
            rootSchema={rootSchema}
            handleChange={handleChange}
            errors={errors}
            config={config}
          />
        }
      />
    </Hidden>
  );
};

export const materialBooleanControlTester: RankedTester = rankWith(
  2,
  isBooleanControl
);
export default withJsonFormsControlProps(MaterialBooleanControl);

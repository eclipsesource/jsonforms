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
import { connect } from 'react-redux';
import {
  ControlProps,
  isBooleanControl,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';

import { FormControlLabel, Hidden } from '@material-ui/core';

import MaterialBooleanField from '../fields/MaterialBooleanField';

export const MaterialBooleanControl =
  ({ label, uischema, schema, visible, path, id }: ControlProps) => (
    <Hidden xsUp={!visible}>
      <FormControlLabel
        label={label}
        id={id}
        control={
          <MaterialBooleanField
            uischema={uischema}
            schema={schema}
            path={path}
            id={id + '-input'}
          />
        }
      />
    </Hidden>
  );

const ConnectedMaterialBooleanControl = connect(mapStateToControlProps)(MaterialBooleanControl);
export const materialBooleanControlTester: RankedTester = rankWith(2, isBooleanControl);
export default ConnectedMaterialBooleanControl;

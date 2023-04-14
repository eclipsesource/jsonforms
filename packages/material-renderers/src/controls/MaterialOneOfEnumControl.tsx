/*
  The MIT License

  Copyright (c) 2018-2020 EclipseSource Munich
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
  ControlProps,
  isOneOfEnumControl,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import {
  TranslateProps,
  withJsonFormsOneOfEnumProps,
  withTranslateProps,
} from '@jsonforms/react';
import {
  MuiAutocomplete,
  WithOptionLabel,
} from '../mui-controls/MuiAutocomplete';
import { MuiSelect } from '../mui-controls/MuiSelect';
import { MaterialInputControl } from '../controls/MaterialInputControl';
import merge from 'lodash/merge';

export const MaterialOneOfEnumControl = (
  props: ControlProps & OwnPropsOfEnum & WithOptionLabel & TranslateProps
) => {
  const { config, uischema, errors } = props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const isValid = errors.length === 0;

  return appliedUiSchemaOptions.autocomplete === false ? (
    <MaterialInputControl {...props} input={MuiSelect} />
  ) : (
    <MuiAutocomplete {...props} isValid={isValid} />
  );
};

export const materialOneOfEnumControlTester: RankedTester = rankWith(
  5,
  isOneOfEnumControl
);

// HOC order can be reversed with https://github.com/eclipsesource/jsonforms/issues/1987
export default withJsonFormsOneOfEnumProps(
  withTranslateProps(React.memo(MaterialOneOfEnumControl)),
  false
);

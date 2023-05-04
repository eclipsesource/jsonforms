/*
  The MIT License

  Copyright (c) 2018-2019 EclipseSource Munich
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
import {
  and,
  ControlProps,
  ControlState,
  EnumCellProps,
  JsonSchema,
  RankedTester,
  rankWith,
  schemaMatches,
  uiTypeIs,
  WithClassname,
} from '@jsonforms/core';
import { Control, withJsonFormsControlProps } from '@jsonforms/react';
import { Input, InputBaseComponentProps } from '@mui/material';
import merge from 'lodash/merge';
import React, { useMemo } from 'react';
import { useDebouncedChange } from '../util';
import { MaterialInputControl } from './MaterialInputControl';

const findEnumSchema = (schemas: JsonSchema[]) =>
  schemas.find(
    (s) => s.enum !== undefined && (s.type === 'string' || s.type === undefined)
  );
const findTextSchema = (schemas: JsonSchema[]) =>
  schemas.find((s) => s.type === 'string' && s.enum === undefined);

const MuiAutocompleteInputText = (props: EnumCellProps & WithClassname) => {
  const {
    data,
    config,
    className,
    id,
    enabled,
    uischema,
    isValid,
    path,
    handleChange,
    schema,
  } = props;
  const enumSchema = findEnumSchema(schema.anyOf);
  const stringSchema = findTextSchema(schema.anyOf);
  const maxLength = stringSchema.maxLength;
  const appliedUiSchemaOptions = useMemo(
    () => merge({}, config, uischema.options),
    [config, uischema.options]
  );
  const inputProps: InputBaseComponentProps = useMemo(() => {
    let propMemo: InputBaseComponentProps = {};
    if (appliedUiSchemaOptions.restrict) {
      propMemo = { maxLength: maxLength };
    }
    if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
      propMemo.size = maxLength;
    }
    propMemo.list = props.id + 'datalist';
    return propMemo;
  }, [appliedUiSchemaOptions, props.id]);
  const [inputText, onChange] = useDebouncedChange(
    handleChange,
    '',
    data,
    path
  );

  const dataList = (
    <datalist id={props.id + 'datalist'}>
      {enumSchema.enum.map((optionValue) => (
        <option value={optionValue} key={optionValue} />
      ))}
    </datalist>
  );
  return (
    <Input
      type='text'
      value={inputText}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
      inputProps={inputProps}
      error={!isValid}
      endAdornment={dataList}
    />
  );
};

export class MaterialAnyOfStringOrEnumControl extends Control<
  ControlProps,
  ControlState
> {
  render() {
    return (
      <MaterialInputControl {...this.props} input={MuiAutocompleteInputText} />
    );
  }
}
const hasEnumAndText = (schemas: JsonSchema[]) => {
  // idea: map to type,enum and check that all types are string and at least one item is of type enum,
  const enumSchema = findEnumSchema(schemas);
  const stringSchema = findTextSchema(schemas);
  const remainingSchemas = schemas.filter(
    (s) => s !== enumSchema || s !== stringSchema
  );
  const wrongType = remainingSchemas.find((s) => s.type && s.type !== 'string');
  return enumSchema && stringSchema && !wrongType;
};
const simpleAnyOf = and(
  uiTypeIs('Control'),
  schemaMatches(
    (schema) =>
      Object.prototype.hasOwnProperty.call(schema, 'anyOf') &&
      hasEnumAndText(schema.anyOf)
  )
);
export const materialAnyOfStringOrEnumControlTester: RankedTester = rankWith(
  5,
  simpleAnyOf
);
export default withJsonFormsControlProps(MaterialAnyOfStringOrEnumControl);

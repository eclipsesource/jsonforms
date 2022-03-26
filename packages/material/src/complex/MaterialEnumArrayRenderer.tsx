import {
  and,
  ControlProps,
  DispatchPropsOfMultiEnumControl,
  hasType,
  JsonSchema,
  OwnPropsOfEnum,
  Paths,
  RankedTester,
  rankWith,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs
} from '@jsonforms/core';

import { withJsonFormsMultiEnumProps } from '@jsonforms/react';
import { MuiCheckbox } from '../mui-controls';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Hidden
} from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

export const MaterialEnumArrayRenderer = ({
  schema,
  visible,
  errors,
  path,
  options,
  data,
  addItem,
  removeItem,
  handleChange,
  ...otherProps
}: ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl) => {
  return (
    <Hidden xlUp={!visible}>
      <FormControl component='fieldset'>
        <FormGroup row>
          {options.map((option: any, index: number) => {
            const optionPath = Paths.compose(path, `${index}`);
            const checkboxValue = data?.includes(option.value)
              ? option.value
              : undefined;
            return (
              <FormControlLabel
                id={option.value}
                key={option.value}
                control={
                  <MuiCheckbox
                    key={'checkbox-' + option.value}
                    isValid={isEmpty(errors)}
                    path={optionPath}
                    handleChange={(_childPath, newValue) =>
                      newValue
                        ? addItem(path, option.value)
                        : removeItem(path, option.value)
                    }
                    data={checkboxValue}
                    errors={errors}
                    schema={schema}
                    visible={visible}
                    {...otherProps}
                  />
                }
                label={option.label}
              />
            );
          })}
        </FormGroup>
        <FormHelperText error>
          {errors}
        </FormHelperText>
      </FormControl>
    </Hidden>
  );
};

const hasOneOfItems = (schema: JsonSchema): boolean =>
  schema.oneOf !== undefined &&
  schema.oneOf.length > 0 &&
  (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
    return entry.const !== undefined;
  });

const hasEnumItems = (schema: JsonSchema): boolean =>
  schema.type === 'string' && schema.enum !== undefined;

export const materialEnumArrayRendererTester: RankedTester = rankWith(
  5,
  and(
    uiTypeIs('Control'),
    and(
      schemaMatches(
        schema =>
          hasType(schema, 'array') &&
          !Array.isArray(schema.items) &&
          schema.uniqueItems === true
      ),
      schemaSubPathMatches('items', schema => {
        return hasOneOfItems(schema) || hasEnumItems(schema);
      })
    )
  )
);

export default withJsonFormsMultiEnumProps(MaterialEnumArrayRenderer);

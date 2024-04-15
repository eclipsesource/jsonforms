import {
  and,
  ControlProps,
  DispatchPropsOfMultiEnumControl,
  hasType,
  isDescriptionHidden,
  JsonSchema,
  OwnPropsOfEnum,
  Paths,
  RankedTester,
  rankWith,
  resolveSchema,
  schemaMatches,
  schemaSubPathMatches,
  showAsRequired,
  uiTypeIs,
} from '@jsonforms/core';

import { withJsonFormsMultiEnumProps } from '@jsonforms/react';
import { MuiCheckbox } from '../mui-controls';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import merge from 'lodash/merge';
import { useFocus } from '../util';

export const MaterialEnumArrayRenderer = ({
  config,
  id,
  schema,
  visible,
  errors,
  description,
  label,
  required,
  path,
  options,
  data,
  addItem,
  removeItem,
  handleChange: _handleChange,
  ...otherProps
}: ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl) => {
  const [focused, onFocus, onBlur] = useFocus();
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, otherProps.uischema.options);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  if (!visible) {
    return null;
  }

  return (
    <FormControl
      component='fieldset'
      fullWidth={!appliedUiSchemaOptions.trim}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <FormLabel
        error={!isValid}
        component='legend'
        required={showAsRequired(
          required,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
      >
        {label}
      </FormLabel>
      <FormGroup row>
        {options.map((option: any, index: number) => {
          const optionPath = Paths.compose(path, `${index}`);
          const checkboxValue = data?.includes(option.value)
            ? option.value
            : undefined;
          return (
            <FormControlLabel
              id={id + '-label-' + option.value}
              key={option.value}
              control={
                <MuiCheckbox
                  id={id + '-' + option.value}
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
      <FormHelperText error={!isValid}>
        {!isValid ? errors : showDescription ? description : null}
      </FormHelperText>
    </FormControl>
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
        (schema) =>
          hasType(schema, 'array') &&
          !Array.isArray(schema.items) &&
          schema.uniqueItems === true
      ),
      schemaSubPathMatches('items', (schema, rootSchema) => {
        const resolvedSchema = schema.$ref
          ? resolveSchema(rootSchema, schema.$ref, rootSchema)
          : schema;
        return hasOneOfItems(resolvedSchema) || hasEnumItems(resolvedSchema);
      })
    )
  )
);

export default withJsonFormsMultiEnumProps(MaterialEnumArrayRenderer);

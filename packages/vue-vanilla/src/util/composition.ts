import { useStyles } from '../styles';
import { Options, optionsInit } from './options';
import { ref, watchEffect } from '../../config';
import merge from 'lodash/merge';
import {
  composePaths,
  findUISchema,
  getFirstPrimitiveProp,
  Resolve,
  UISchemaElement
} from '@jsonforms/core';

export type Nullable<T> = {
  [P in keyof T]: P | null;
};

/**
 * Adds styles, isFocused, appliedOptions and onChange
 */
export const useVanillaControl = <
  I extends { control: any; handleChange: any }
>(
  input: I,
  adaptTarget: (target: any) => any = v => v.value
) => {
  const appliedOptions = ref<Nullable<Options>>(optionsInit());
  watchEffect(() => {
    appliedOptions.value = merge(
      {},
      input.control.value.config,
      input.control.value.uischema.options
    );
  });
  const isFocused = ref(false);
  const onChange = (event: Event) => {
    input.handleChange(input.control.value.path, adaptTarget(event.target));
  };
  return {
    ...input,
    styles: useStyles(input.control.value.uischema),
    isFocused,
    appliedOptions,
    onChange
  };
};

/**
 * Adds styles and appliedOptions
 */
export const useVanillaLayout = <I extends { layout: any }>(input: I) => {
  const appliedOptions = ref<Nullable<Options>>(optionsInit());
  watchEffect(() => {
    appliedOptions.value = merge(
      {},
      input.layout.value.config,
      input.layout.value.uischema.options
    );
  });
  return {
    ...input,
    styles: useStyles(input.layout.value.uischema),
    appliedOptions
  };
};

/**
 * Adds styles, appliedOptions and childUiSchema
 */
export const useVanillaArrayControl = <I extends { control: any }>(
  input: I
) => {
  const appliedOptions = ref<Nullable<Options>>(optionsInit());
  watchEffect(() => {
    appliedOptions.value = merge(
      {},
      input.control.value.config,
      input.control.value.uischema.options
    );
  });
  const childUiSchema = ref<UISchemaElement>();
  watchEffect(() => {
    childUiSchema.value = findUISchema(
      input.control.value.uischemas,
      input.control.value.schema,
      input.control.value.uischema.scope,
      input.control.value.path
    );
  });
  const childLabelForIndex = (index: number) => {
    const childLabelProp =
      input.control.value.uischema.options?.childLabelProp ??
      getFirstPrimitiveProp(input.control.value.schema);
    if (!childLabelProp) {
      return `${index}`;
    }
    const labelValue = Resolve.data(
      input.control.value.data,
      composePaths(`${index}`, childLabelProp)
    );
    if (labelValue === undefined || labelValue === null || labelValue === NaN) {
      return '';
    }
    return `${labelValue}`;
  };
  return {
    ...input,
    styles: useStyles(input.control.value.uischema),
    appliedOptions,
    childUiSchema,
    childLabelForIndex
  };
};

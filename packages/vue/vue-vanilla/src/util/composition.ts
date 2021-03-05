import { useStyles } from '../styles';
import { Options, optionsInit } from './options';
import { Ref, ref, watch } from '../../config/vue';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
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

const updateOptions = (
  appliedOptionsRef: Ref<Nullable<Options>>,
  controlRef: any
) => {
  appliedOptionsRef.value = merge(
    {},
    cloneDeep(controlRef.value.config),
    cloneDeep(controlRef.value.uischema.options)
  );
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
  updateOptions(appliedOptions, input.control);
  watch(
    () => [input.control.value.config, input.control.value.uischema],
    () => {
      updateOptions(appliedOptions, input.control);
    }
  );
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
  updateOptions(appliedOptions, input.layout);
  watch(
    () => [input.layout.value.config, input.layout.value.uischema],
    () => {
      updateOptions(appliedOptions, input.layout);
    }
  );
  return {
    ...input,
    styles: useStyles(input.layout.value.uischema),
    appliedOptions
  };
};

const updateUiSchema = (
  uiSchemaRef: Ref<UISchemaElement | undefined>,
  controlRef: any
) => {
  uiSchemaRef.value = findUISchema(
    controlRef.value.uischemas,
    controlRef.value.schema,
    controlRef.value.uischema.scope,
    controlRef.value.path
  );
};

/**
 * Adds styles, appliedOptions and childUiSchema
 */
export const useVanillaArrayControl = <I extends { control: any }>(
  input: I
) => {
  const appliedOptions = ref<Nullable<Options>>(optionsInit());
  updateOptions(appliedOptions, input.control);
  watch(
    () => [input.control.value.config, input.control.value.uischema],
    () => {
      updateOptions(appliedOptions, input.control);
    }
  );
  const childUiSchema = ref<UISchemaElement>();
  updateUiSchema(childUiSchema, input.control);
  watch(
    () => [
      input.control.value.uischemas,
      input.control.value.schema,
      input.control.value.uischema.scope,
      input.control.value.path
    ],
    () => {
      updateUiSchema(childUiSchema, input.control);
    }
  );
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

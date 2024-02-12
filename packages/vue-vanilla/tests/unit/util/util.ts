import { mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';
import TestComponentWithCustomControlWrapper from './TestComponentWithCustomControlWrapper.vue';

export const mountJsonForms = (
  data: any,
  schema: any,
  uischema?: any,
  config?: any
) => {
  return mount(TestComponent, {
    props: { initialData: data, schema, uischema, config },
  });
};

export const mountJsonFormsWithCustomControlWrapper = (
  data: any,
  schema: any,
  uischema?: any,
  config?: any
) => {
  return mount(TestComponentWithCustomControlWrapper, {
    props: { initialData: data, schema, uischema, config },
  });
};

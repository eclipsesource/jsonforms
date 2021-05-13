import { mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';

export const mountJsonForms = (
  data: any,
  schema: any,
  uischema?: any,
  config?: any
) => {
  return mount(TestComponent, {
    props: { initialData: data, schema, uischema, config }
  });
};

export const addRemoveWhenEmptyOption = (uischema: any) => {
  return {
    ...uischema,
    options: {
      ...uischema.options,
      removeWhenEmpty: true
    }
  };
};

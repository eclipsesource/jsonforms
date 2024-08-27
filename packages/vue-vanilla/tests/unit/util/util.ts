import { mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';

export const mountJsonForms = (
  data: any,
  schema: any,
  uischema?: any,
  config?: any
) => {
  return mount(TestComponent, {
    props: { initialData: data, schema, uischema, config },
    // Attach mounted component to document. Without this, some events are not triggered as expected.
    // E.g. a click on a checkbox input would not result in a change event.
    attachTo: document.body,
  });
};

import { JsonForms } from '@jsonforms/core';
// declare let $;

export const applyMaterialStyle = () => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'waves-effect', 'waves-light']
    }
  ]);
};

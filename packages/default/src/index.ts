import { JsonForms } from 'jsonforms-core';
export * from './additional';
export * from './controls';
export * from './layouts';
export * from './fields';

JsonForms.stylingRegistry.registerMany([
  {
    name: 'control',
    classNames: ['control']
  },
  {
    name: 'control.trim',
    classNames: ['trim']
  },
  {
    name: 'control.label',
    classNames: ['control']
  },
  {
    name: 'control.input',
    classNames: ['input']
  },
  {
    name: 'control.validation',
    classNames: ['validation']
  },
  {
    name: 'categorization',
    classNames: ['jsf-categorization']
  },
  {
    name: 'categorization.master',
    classNames: ['jsf-categorization-master']
  },
  {
    name: 'categorization.detail',
    classNames: ['jsf-categorization-detail']
  },
  {
    name: 'category.group',
    classNames: ['jsf-category-group']
  },
  {
    name: 'array.layout',
    classNames: ['array-layout']
  },
  {
    name: 'array.children',
    classNames: ['children']
  },
  {
    name: 'group-layout',
    classNames: ['group-layout']
  },
  {
    name: 'horizontal-layout',
    classNames: ['horizontal-layout']
  },
  {
    name: 'vertical-layout',
    classNames: ['vertical-layout']
  },
  {
    name: 'array-table',
    classNames: ['array-table-layout', 'control']
  }
]);

import { JsonForms } from '../src/core';
import { createExampleSelection } from './example';
import { createThemeSelection } from './theme.switcher';
import './templates/arrays';
import './templates/day2';
import './templates/day4';
import './templates/day5';
import './templates/day6';
import './templates/generate';
import './templates/generate-ui';
import './templates/layout';
import './templates/person';
import './templates/rule';
import './templates/dynamic';
import './templates/dynamic2';
import './templates/categorization';
import './templates/masterdetail';
import './templates/resolve';
import './templates/uischema-registry';
import './templates/ecore';

window.onload = ev => {
  const selectExampleElement = createExampleSelection();
  createThemeSelection();
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control']
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
};

import { JsonForms } from 'jsonforms-core';
import { createExampleSelection } from '../src/register';
import { createThemeSelection } from './theme.switcher';
import 'jsonforms-default';

window.onload = ev => {
  createExampleSelection();
  createThemeSelection();
};

import { createExampleSelection } from '../../examples/src/register';
import { createThemeSelection } from './theme.switcher';
import { vanillaStyles } from '../src/util';

window.onload = () => {
  createExampleSelection({styles: vanillaStyles});
  createThemeSelection();
};

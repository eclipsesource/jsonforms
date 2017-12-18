import { createExampleSelection } from '../../examples/src/register';
import { createThemeSelection } from './theme.switcher';

window.onload = () => {
  createExampleSelection();
  createThemeSelection();
};

import { createExampleSelection } from '../../examples/src/register';
import { createThemeSelection } from './theme.switcher';
import { vanillaStyles } from '../src/util';
import { stylingReducer } from '../src/reducers';
import { vanillaFields, vanillaRenderers } from '../src';

window.onload = () => {
  createExampleSelection(
    vanillaRenderers,
    vanillaFields,
    {
      name: 'styles',
      reducer: stylingReducer,
      state: vanillaStyles
    }
  );
  createThemeSelection();
};

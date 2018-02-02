import { createExampleSelection } from '../../examples/src/register';
import { createThemeSelection } from './theme.switcher';
import { vanillaStyles } from '../src/util';
import { stylingReducer } from '../src/reducers';

window.onload = () => {
  createExampleSelection(
    {
      name: 'styles',
      reducer: stylingReducer,
      state: vanillaStyles
    }
  );
  createThemeSelection();
};

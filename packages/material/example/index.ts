import { createExampleSelection } from '../../examples/src/register';
import { materialFields, materialRenderers } from '../src';

window.onload = () => {
  createExampleSelection(
    materialRenderers,
    materialFields
  );
};

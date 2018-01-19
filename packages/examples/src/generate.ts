import { registerExamples } from './register';
import { data as personData } from './person';

export const schema = undefined;
export const uischema = undefined;
export const data = personData;

registerExamples([
  {
    name: 'generate',
    label: 'Generate both Schemas',
    data,
    schema,
    uiSchema: uischema
  }
]);

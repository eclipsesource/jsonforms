import { registerExamples } from './register';
import { data as personData,  } from './person';

export const schema = undefined;
export const uischema = undefined;
export const data = personData;

registerExamples([
  {
    name: 'generate-ui',
    label: 'Generate UI Schema',
    data,
    schema,
    uiSchema: uischema
  }
]);

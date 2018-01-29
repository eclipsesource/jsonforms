import { registerExamples } from './register';
import {data as personData, personCoreSchema } from './person';

export const schema = personCoreSchema;
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

import { registerExamples } from './register';

export const schema = undefined;
export const uischema = undefined;
export const data = {
  name: 'John Doe',
  age: 36
};
registerExamples([
  {
    name: 'generate',
    label: 'Generate both Schemas',
    data,
    schema,
    uiSchema: uischema
  }
]);

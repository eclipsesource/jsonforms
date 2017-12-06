import { registerExamples } from './register';

export const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'age': {
      'type': 'integer'
    }
  }
};
export const uischema = undefined;
export const data = {
  name: 'John Doe',
  age: 36
};
registerExamples([
  {
    name: 'generate-ui',
    label: 'Generate UI Schema',
    data,
    schema,
    uiSchema: uischema
  }
]);

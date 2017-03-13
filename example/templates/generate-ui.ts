import {registerExamples} from '../example';
const schema = {
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
const uischema = undefined;
const data = {
  name: 'John Doe',
  age: 36
};
registerExamples([
  {name: 'generate-ui', label: 'Generate UI Schema', data: data, schema: schema, uiSchema: uischema}
]);

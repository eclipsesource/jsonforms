import {registerExamples} from '../example';
const schema = undefined;
const uischema = undefined;
const data = {
  name: 'John Doe',
  age: 36
};
registerExamples([
  {name: 'generate', label: 'Generate both Schemas', data: data, schema: schema, uiSchema: uischema}
]);

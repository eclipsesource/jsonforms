import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    done: {
      type: 'boolean'
    }
  },
  required: ['name']
};

export const data = {
  name: 'Send email to Adrian',
  description: 'Confirm if you have passed the subject\nHereby ...',
  done: true,
};
registerExamples([
  {
    name: 'day1',
    label: 'Day 1',
    data,
    schema,
    uiSchema: undefined
  }
]);

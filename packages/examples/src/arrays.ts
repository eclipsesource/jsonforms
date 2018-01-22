import { registerExamples } from './register';
import { personCoreSchema } from './person';

export const schema = {
  type: 'object',
  properties: {
    ...personCoreSchema.properties,
    occupation: { type: 'string' },
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date'
          },
          message: {
            type: 'string',
            maxLength: 5
          }
        }
      }
    }
  },
  required: ['occupation', 'nationality']
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: {
        $ref: '#/properties/comments'
      }
    }
  ]
};

export const data = {
  comments: [
    {
      date: new Date(2001, 8, 11).toISOString().substr(0, 10),
      message: 'This is an example message'
    },
    {
      date: new Date().toISOString().substr(0, 10),
      message: 'Get ready for booohay'
    }
  ]
};

registerExamples([
  {
    name: 'array',
    label: 'Array',
    data,
    schema,
    uiSchema: uischema
  },
]);

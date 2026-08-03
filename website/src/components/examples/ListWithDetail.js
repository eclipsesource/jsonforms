import React from 'react';
import { Demo } from '../common/Demo';

const schema = {
  type: 'object',
  properties: {
    users: {
      type: 'array',
      items: {
        type: 'object',
        title: 'Users',
        properties: {
          firstname: {
            type: 'string'
          },
          lastname: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          },
          age: {
            type: 'number',
            minimum: 0
          }
        },
        required: ['firstname']
      }
    }
  }
}

const uischema = {
  type: 'ListWithDetail',
  scope: '#/properties/users',
  options: {
    detail: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/firstname',
              label: 'First Name'
            },
            {
              type: 'Control',
              scope: '#/properties/lastname',
              label: 'Last Name'
            }
          ]
        },
        {
          type: 'Control',
          scope: '#/properties/age',
          label: 'Age'
        },
        {
          type: 'Control',
          scope: '#/properties/email',
          label: 'Email'
        }
      ]
    }
  }
}

const data = {
  users: [
    {
      firstname: 'Max',
      lastname: 'Mustermann',
      age: 25,
      email: 'max@mustermann.com'
    },
    {
      firstname: 'John',
      lastname: 'Doe',
      age: 35,
      email: 'john@doe.com'
    }
  ]
}

const MasterDetail = () => {
  return (
    <Demo
      data={data}
      schema={schema}
      uischema={uischema}
    />
  );
};

export default MasterDetail;

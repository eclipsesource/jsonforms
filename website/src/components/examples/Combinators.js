import React from 'react';
import { Demo } from '../common';

const data = {
  addressOrUser: {
    street_address: '1600 Pennsylvania Avenue NW',
    city: 'Washington',
    state: 'DC'
  }
}

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: "Basic Information",
      scope: '#/properties/addressOrUser'
    }
  ]
} 

const schema = {
  definitions: {
    address: {
      type: 'object',
      title: 'Address',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' }
      },
      required: ['street_address', 'city', 'state']
    },
    user: {
      type: 'object',
      title: 'User',
      properties: {
        name: { type: 'string' },
        mail: { type: 'string' }
      },
      required: ['name', 'mail']
    },
  },
  type: 'object'
}

export const AnyOf = () => {
  const anySchema = {
    ...schema,
    properties: {
      addressOrUser: {
        anyOf: [{ $ref: '#/definitions/address' }, { $ref: '#/definitions/user' }]
      }
    }
  }
  return (
    <Demo
      data={data}
      schema={anySchema}
      uischema={uischema}
    />
  );
};

export const AllOf = () => {
  const allSchema = {
    ...schema,
    properties: {
      addressOrUser: {
        allOf: [{ $ref: '#/definitions/address' }, { $ref: '#/definitions/user' }]
      }
    }
  }
  return (
    <Demo
      data={data}
      schema={allSchema}
      uischema={uischema}
    />
  );
}

export const OneOf = () => {
  const oneSchema = {
    ...schema,
    properties: {
      addressOrUser: {
        oneOf: [{ $ref: '#/definitions/address' }, { $ref: '#/definitions/user' }]
      }
    }
  }
  return (
    <Demo
      data={data}
      schema={oneSchema}
      uischema={uischema}
    />
  );
}

import React, { useCallback, useState } from 'react';
import { Demo } from '../common/Demo';
import { materialRenderers } from '@jsonforms/material-renderers';
import { INIT, UPDATE_DATA } from '@jsonforms/core';

const schema = {
  type: 'object',
  properties: {
    services: {
      type: 'array',
      uniqueItems: true,
      items: {
        oneOf: [
          { const: 'Wash (15$)' },
          { const: 'Polish (15$)' },
          { const: 'Interior (15$)' },
        ],
      },
    },
    price: {
      type: 'number',
      readOnly: true,
    },
  },
};

const inputData = {
  services: ['Wash (15$)', 'Polish (15$)'],
};

export const DependentFieldExample = () => {
  const [data, setData] = useState(inputData);

  const middleware = useCallback((state, action, defaultReducer) => {
    const newState = defaultReducer(state, action);
    switch (action.type) {
      case INIT:
      case UPDATE_DATA: {
        if (newState.data.services.length * 15 !== newState.data.price) {
          newState.data.price = newState.data.services.length * 15;
        }
        setData(newState.data);
        return newState;
      }
      default:
        return newState;
    }
  });

  return (
    <Demo
      data={data}
      schema={schema}
      renderers={materialRenderers}
      middleware={middleware}
    />
  );
};

const activity = {
  type: 'object',
  properties: {
    activity: {
      type: 'string',
      enum: ['Snowboarding', 'Soccer', 'Staying at Home'],
    },
  },
};

export const ControlledStyle = () => {
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState({ activity: 'Snowboarding' });

  const validateActivity = useCallback((data) => {
    switch (data.activity) {
      case 'Snowboarding':
        setErrors([
          {
            instancePath: '/activity',
            message: 'No Snow',
            schemaPath: '#/properties/activity',
          },
        ]);
        break;
      case 'Soccer':
        setErrors([
          {
            instancePath: '/activity',
            message: 'Too Cold',
            schemaPath: '#/properties/activity',
          },
        ]);
        break;
      default:
        setErrors([]);
    }
  }, []);

  const middleware = useCallback((state, action, defaultReducer) => {
    const newState = defaultReducer(state, action);
    switch (action.type) {
      case INIT:
      case UPDATE_DATA: {
        setData(newState.data);
        validateActivity(newState.data);
        return state;
      }
      default:
        return newState;
    }
  }, []);

  return (
    <Demo
      data={data}
      schema={activity}
      renderers={materialRenderers}
      middleware={middleware}
      additionalErrors={errors}
      validationMode='NoValidation'
    />
  );
};

export default DependentFieldExample;

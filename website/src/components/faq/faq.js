import React, { useMemo, useState } from 'react';
import { Demo } from '../common/Demo';
import { materialRenderers } from '@jsonforms/material-renderers';

const schema = {
  type: 'object',
  properties: {
    services: {
      type: 'array',
      uniqueItems: true,
      items: {
        oneOf: [{ const: 'Wash (15$)' }, { const: 'Polish (15$)' }, { const: 'Interior (15$)' }],
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
  const [formData, setFormData] = useState(inputData);
  
  const onChange = ({ data, _errors }) => {
    const price = data.services.length*15;
    if (data.price === price){
        setFormData(data);
    }else{
        setFormData({...data, price: price})
    }
  }

  return (
    <Demo
      data={formData}
      schema={schema}
      renderers={[...materialRenderers]}
      onChange={onChange}
    />
  );
};

export default DependentFieldExample;

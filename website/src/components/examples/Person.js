import React from 'react';
import { person } from '@jsonforms/examples';
import { Demo } from '../common';

const Person = () => {
  return (
    <div className='example'>
      <Demo
        data={person.data}
        schema={person.schema}
        uischema={person.uischema}
      />
    </div>
  );
};

export default Person;

import React from 'react';
import { person } from '@jsonforms/examples';
import { JsonFormsDispatch, JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';
import { createJsonFormsStore } from '../../common/store';
import Demo from '../common/Demo';

const Person = () => {
  const store = createJsonFormsStore({
    data: person.data,
    schema: person.schema,
    uischema: person.uischema
  });

  return (
    <div className='example'>
      <Provider store={store}>
        <JsonFormsReduxContext>
          <Demo
            js={() => <JsonFormsDispatch />}
            schema={person.schema}
            uischema={person.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    </div>
  );
};

export default Person;

import React from 'react';
import {person} from '@jsonforms/examples';
import {JsonForms} from '@jsonforms/react';
import {Provider} from 'react-redux';
import {createJsonFormsStore} from "../../common/store";
import Demo from "../common/Demo";

const Person = () => {

  const store = createJsonFormsStore({
    data: person.data,
    schema: person.schema,
    uischema: person.uischema
  });

  return (
    <div className='example'>
      <Provider store={store}>
        <Demo
          js={() => <JsonForms/>}
          schema={person.schema}
          uischema={person.uischema}
        />
      </Provider>
    </div>
  );
};

export default Person;
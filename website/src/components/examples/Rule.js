import React from 'react';
import {rule} from '@jsonforms/examples';
import {JsonForms} from '@jsonforms/react';
import {Provider} from 'react-redux';
import Demo from "../common/Demo";
import {createJsonFormsStore} from "../../common/store";

const RuleExample = () => {

  const store = createJsonFormsStore({
    data: rule.data,
    schema: rule.schema,
    uischema: rule.uischema
  });

  return (
    <Provider store={store}>
      <Demo
        schema={rule.schema}
        uischema={rule.uischema}
        js={() => <JsonForms />}
      />
    </Provider>
  );
};

export default RuleExample;
import React from 'react';
import { Provider } from 'react-redux';
import { person } from '@jsonforms/examples';
import { Demo } from '../../../../components/common';
import { createJsonFormsStore } from "../../../../common/store";

const store = createJsonFormsStore({
    data: person.data,
    schema: person.personCoreSchema,
    uischema: person.uischema
});

export const PersonVars = () => (
    <Provider store={store}>
        <Demo
            schema={person.schema}
            uischema={person.uischema}
            data={person.data}
        />
    </Provider>
)

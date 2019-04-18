import React from 'react';
import {array} from '@jsonforms/examples';
import {JsonForms} from '@jsonforms/react';
import {Provider} from 'react-redux';
import Demo from "../common/Demo";
import {createJsonFormsStore} from "../../common/store";
import styles from '../../styles/global.module.css';

const Array = () => {

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/comments'
      }
    ]
  };
  const store = createJsonFormsStore({
    data: array.data,
    schema: array.schema,
    uischema
  });

  return (
    <div className={styles.example}>
      <Provider store={store}>
        <Demo
          schema={array.schema}
          uischema={uischema}
          style={{
            padding: 0
          }}
          js={() => (
            <React.Fragment>
              <div id='array-demo' className={styles.examples__array}>
                <JsonForms />
              </div>
              <div className={styles.examples__array_note}>
                Our current array renderer is not supported on mobile, sorry.
              </div>
            </React.Fragment>
          )}
        />
      </Provider>
    </div>
  );
};

export default Array;

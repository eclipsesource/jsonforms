import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import schema from './schema.json';
import uischema from './uischema.json';
import { Actions, jsonformsReducer, NOT_APPLICABLE } from '@jsonforms/core';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester'

const data = {
  "firstarray": [
    {
      "objectarrayofstrings": {
        "choices": [
          "CHOICE_STRING_1",
          "CHOICE_STRING_2",
          "CHOICE_STRING_3"
        ]
      }
    }
  ]
};

const store = createStore(
  combineReducers({ jsonforms: jsonformsReducer() }),
  {
    jsonforms: {
      fields: materialFields,
      renderers: materialRenderers
    },
  }
);

store.dispatch(Actions.init(data, schema, uischema));


// Uncomment this line (and respective import) to register our custom renderer
store.dispatch(Actions.registerRenderer(ratingControlTester, RatingControl));

store.dispatch(Actions.registerUISchema(
  (jsonSchema, schemaPath) => {
    return schemaPath === '#/properties/firstarray' ? 2 : NOT_APPLICABLE;
  },
  {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name'
      },
      {
        type: 'Control',
        scope: '#/properties/objectarrayofstrings/properties/choices'
      }
    ]
  }
));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

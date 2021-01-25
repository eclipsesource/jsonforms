import React from 'react';
import { Provider } from 'react-redux';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { createJsonFormsStore } from '../../../../common/store';
import { Demo } from '../../../../components/common';

export const input = {
  schema: {
    properties: {
      name: { type: 'string' },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/name',
  },
  data: {
    name: 'Ottgar',
  },
};

const store = createJsonFormsStore({
  data: input.data,
  schema: input.schema,
  uischema: input.uischema,
});

export const Example = () => (
  <Provider store={store}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          return (
            <JsonFormsDispatch
              schema={input.schema}
              uischema={input.uischema}
            />
          );
        }}
        schema={input.schema}
        uischema={input.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const customLabelInput = {
  schema: {
    properties: {
      name: { type: 'string' },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/name',
    label: 'First name',
  },
  data: {
    name: 'Ottgar',
  },
};

const storeWithCustomLabel = createJsonFormsStore({
  data: customLabelInput.data,
  schema: customLabelInput.schema,
  uischema: customLabelInput.uischema,
});

export const ExampleWithCustomLabel = () => (
  <Provider store={storeWithCustomLabel}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          return (
            <JsonFormsDispatch
              schema={customLabelInput.schema}
              uischema={customLabelInput.uischema}
            />
          );
        }}
        schema={customLabelInput.schema}
        uischema={customLabelInput.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const sortButtons = {
  schema: {
    properties: {
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/comments',
        options: {
          showSortButtons: true,
        },
      },
    ],
  },
  data: {
    comments: [
      {
        name: 'John Doe',
        message: 'This is an example message',
      },
      {
        name: 'Max Mustermann',
        message: 'Get ready for booohay',
      },
    ],
  },
};

const storeWithSortButtons = createJsonFormsStore({
  data: sortButtons.data,
  schema: sortButtons.schema,
  uischema: sortButtons.uischema,
});

export const ExampleWithSortButtons = () => (
  <Provider store={storeWithSortButtons}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          return (
            <JsonFormsDispatch
              schema={sortButtons.schema}
              uischema={sortButtons.uischema}
            />
          );
        }}
        schema={sortButtons.schema}
        uischema={sortButtons.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const arrayLabel = {
  schema: {
    properties: {
      comments: {
        type: 'array',
        title: 'Comments',
        items: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/comments',
        options: {
          elementLabelProp: 'name',
          detail: {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/message',
              },
              {
                type: 'Control',
                scope: '#/properties/name',
              },
            ],
          },
        },
      },
    ],
  },
  data: {
    comments: [
      {
        name: 'John Doe',
        message: 'This is an example message',
      },
      {
        name: 'Max Mustermann',
        message: 'Another message',
      },
    ],
  },
};

const storeWithArrayLabel = createJsonFormsStore({
  data: arrayLabel.data,
  schema: arrayLabel.schema,
  uischema: arrayLabel.uischema,
});

export const ExampleWithArrayLabel = () => (
  <Provider store={storeWithArrayLabel}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          return (
            <JsonFormsDispatch
              schema={arrayLabel.schema}
              uischema={arrayLabel.uischema}
            />
          );
        }}
        schema={arrayLabel.schema}
        uischema={arrayLabel.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const radioGroup = {
  schema: {
    type: 'object',
    properties: {
      exampleRadioEnum: {
        type: 'string',
        enum: ['One', 'Two', 'Three'],
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/exampleRadioEnum',
    options: {
      format: 'radio',
    },
  },
  data: {},
};

const storeWithRadioGroup = createJsonFormsStore({
  data: radioGroup.data,
  schema: radioGroup.schema,
  uischema: radioGroup.uischema,
});

export const ExampleWithRadioGroup = () => (
  <Provider store={storeWithRadioGroup}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          return (
            <JsonFormsDispatch
              schema={radioGroup.schema}
              uischema={radioGroup.uischema}
            />
          );
        }}
        schema={radioGroup.schema}
        uischema={radioGroup.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

const storeWithCustomClearBackground = createJsonFormsStore({
  data: input.data,
  schema: input.schema,
  uischema: input.uischema,
});

export const ExampleWithCustomClearBackground = () => (
  <Provider store={storeWithCustomClearBackground}>
    <JsonFormsReduxContext>
      <Demo
        js={() => {
          return (
            <ThemeProvider
              theme={{
                jsonforms: { input: { delete: { background: '#f44336' } } },
              }}
            >
              <JsonFormsDispatch
                schema={input.schema}
                uischema={input.uischema}
              />
            </ThemeProvider>
          );
        }}
        schema={input.schema}
        uischema={input.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

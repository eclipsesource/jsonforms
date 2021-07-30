import React from 'react';
import { JsonFormsDispatch } from '@jsonforms/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Demo } from '../common/Demo';

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

export const Example = () => (
  <Demo
    data={input.data}
    schema={input.schema}
    uischema={input.uischema}
  />
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

export const ExampleWithCustomLabel = () => (
  <Demo
    data={customLabelInput.data}
    schema={customLabelInput.schema}
    uischema={customLabelInput.uischema}
  />
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

export const ExampleWithSortButtons = () => (
  <Demo
    data={sortButtons.data}
    schema={sortButtons.schema}
    uischema={sortButtons.uischema}
  />
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

export const ExampleWithArrayLabel = () => (
  <Demo
    data={arrayLabel.data}
    schema={arrayLabel.schema}
    uischema={arrayLabel.uischema}
  />
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

export const ExampleWithRadioGroup = () => (
  <Demo
    data={radioGroup.data}
    schema={radioGroup.schema}
    uischema={radioGroup.uischema}
  />
);

export const ExampleWithCustomClearBackground = () => (
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
    data={input.data}
    schema={input.schema}
    uischema={input.uischema}
  />
);

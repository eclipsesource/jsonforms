import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Demo } from '../common/Demo';

export const Array = () => {
  const theme = createTheme({
    overrides: {
      MuiSelect: {
        select: {
          minWidth: 250,
        },
      },
    },
  });

  const schema = {
    type: 'object',
    properties: {
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
            },
            message: {
              type: 'string',
              maxLength: 5,
            },
            enum: {
              type: 'string',
              enum: ['foo', 'bar'],
            },
          },
        },
      },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/comments',
      },
    ],
  };

  const data = {
    comments: [
      {
        date: new Date(2001, 8, 11).toISOString().substr(0, 10),
        message: 'This is an example message',
      },
      {
        date: new Date().toISOString().substr(0, 10),
        message: 'Get ready for booohay',
      },
    ],
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div sx={{ display: { xs: 'none', md: 'block' }}}>
          <Demo
            id='array-demo'
            schema={schema}
            uischema={uischema}
            data={data}
            style={{
              padding: 0,
            }}
          />
        </div>
      </ThemeProvider>
      <div sx={{ display: { xs: 'block', md: 'none' }}}>
        Our current array renderer is not supported on mobile, sorry.
      </div>
    </div>
  );
};

export default Array;

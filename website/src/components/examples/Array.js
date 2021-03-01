import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Demo from '../common/Demo';
import styles from '../../styles/global.module.css';

const Array = () => {
  const theme = createMuiTheme({
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
    <div className={styles.example}>
      <ThemeProvider theme={theme}>
        <Demo
          id='array-demo'
          className={styles.examples__array}
          schema={schema}
          uischema={uischema}
          data={data}
          style={{
            padding: 0,
          }}
        />
      </ThemeProvider>
      <div className={styles.examples__array_note}>
        Our current array renderer is not supported on mobile, sorry.
      </div>
    </div>
  );
};

export default Array;

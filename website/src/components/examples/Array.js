import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/core';
import { Demo } from '../common/Demo';

const useStyles = makeStyles((theme) =>
  createStyles({
    example_array_note: {
      display: 'none',
      "@media only screen and (max-width: 850px)": {
        display: 'block'
      }
    },
    example_array: {
      "@media only screen and (max-width: 850px)": {
        display: 'none'
      }
    }
  })
);

export const Array = () => {
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

  const classes = useStyles();

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className={classes.example_array}>
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
      <div className={classes.example_array_note}>
        Our current array renderer is not supported on mobile, sorry.
      </div>
    </div>
  );
};

export default Array;

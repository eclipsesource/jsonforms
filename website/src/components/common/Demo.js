import React, { useState } from 'react';
import clsx from 'clsx';
import { JsonForms } from '@jsonforms/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Highlight, { defaultProps } from "prism-react-renderer";
import usePrismTheme from '@theme/hooks/usePrismTheme';

const demoStyles = makeStyles((theme) =>
  createStyles({
    root: {
      color: '#000',
      marginBottom: 20,
      margin: 'auto',
    },
    tabs: {
      '& li:first-child': {
        marginRight: 'auto'
      }
    },
    demoTab: {
      borderRadius: 'var(--ifm-pre-border-radius)',
      padding: '16px',
      border: '1px solid #eee'
    },
  })
);

const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.8em 0',
        },
      }
    },
  },
});

const defaultTheme = createTheme();

const codeStyle = makeStyles((theme) =>
  createStyles({
    codeblockName: {
      backgroundColor: '#292d3e',
      color: '#fff',
      borderTopRightRadius: 'var(--ifm-pre-border-radius)',
      borderTopLeftRadius: 'var(--ifm-pre-border-radius)',
      borderBottom: '1px solid #eee',
      fontSize: 'var(--ifm-code-font-size)',
      fontWeight: 500,
      padding: '.75rem var(--ifm-pre-padding)'
    },
    codeBlockWithTitle: {
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
    }
  })
);

const Code = (props) => {
  const classes = codeStyle();

  let content = props.children;
  let codeBlockTitle = props.name;
  if(content === undefined) {
    content = {};
  }
  const code = JSON.stringify(content, null, 2).replace(/\n$/, '');
  const prismTheme = usePrismTheme();
  return (
    <Highlight {...defaultProps} code={code} language="json" theme={prismTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div>
          {codeBlockTitle && (
            <div className={classes.codeblockName}>
              {codeBlockTitle}
            </div>
          )}
          <pre className={clsx(className, { [classes.codeBlockWithTitle]: codeBlockTitle })} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

export const Demo = (props) => {
  const { data: inputData, schema, uischema, id } = props;
  const [data, setData] = useState(inputData);

  const classes = demoStyles();
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={classes.root} id={id}>
        <Tabs
          defaultValue="demo"
          values={[
            {label: 'Demo', value: 'demo'},
            {label: 'Schema', value: 'schema'},
            {label: 'UI Schema', value: 'uischema'},
            {label: 'Data', value: 'data'},
          ]}
          className={classes.tabs}>
          <TabItem value="demo" className={clsx('demoTab', classes.demoTab)}>
            <ThemeProvider theme={theme}>
              <JsonForms
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data }) => setData(data)}
                {...props}
              />
            </ThemeProvider>
          </TabItem>
          <TabItem value="schema">
            <Code name="schema.json">{schema}</Code>
          </TabItem>
          <TabItem value="uischema">
            <Code name="uischema.json">{uischema}</Code>
          </TabItem>
          <TabItem value="data">
            <Code>{data}</Code>
          </TabItem>
        </Tabs>
      </div>
    </ThemeProvider>
  );
};

export default Demo;

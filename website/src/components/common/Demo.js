import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Highlight, themes } from "prism-react-renderer";
import { usePrismTheme } from '@docusaurus/theme-common';

const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.8em 0',
        },
      },
      defaultProps: {
        variant: 'standard'
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard'
      }
    }
  },
});

const defaultTheme = createTheme();

const CodeBlockName = styled('div')({
  backgroundColor: '#292d3e',
  color: '#fff',
  borderTopRightRadius: 'var(--ifm-pre-border-radius)',
  borderTopLeftRadius: 'var(--ifm-pre-border-radius)',
  borderBottom: '1px solid #eee',
  fontSize: 'var(--ifm-code-font-size)',
  fontWeight: 500,
  padding: '.75rem var(--ifm-pre-padding)'
});

const CodeBlock = styled('pre')({
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
});

const TabsWrapper = styled('div')({
  color: '#000',
  marginBottom: 20,
  margin: 'auto',
});

const TabsContainer = styled(Tabs)({
  '& li:first-child': {
    marginRight: 'auto',
  },
});

const DemoTab = styled(TabItem)({
  borderRadius: 'var(--ifm-pre-border-radius)',
  padding: '16px',
  border: '1px solid #eee'
});

const Code = (props) => {
  let content = props.children;
  let codeBlockTitle = props.name;
  if(content === undefined) {
    content = {};
  }
  const code = JSON.stringify(content, null, 2).replace(/\n$/, '');
  const prismTheme = usePrismTheme();
  return (
    <Highlight code={code} language="json" theme={prismTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div>
          {codeBlockTitle && (
            <CodeBlockName>
              {codeBlockTitle}
            </CodeBlockName>
          )}
          <CodeBlock style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </CodeBlock>
        </div>
      )}
    </Highlight>
  )
}

export const Demo = (props) => {
  const { data: inputData, schema, uischema, id, i18n } = props;
  const [data, setData] = useState(inputData);

  return (
    <ThemeProvider theme={defaultTheme}>
      <TabsWrapper id={id}>
        <TabsContainer
          defaultValue="demo"
          values={[
            {label: 'Demo', value: 'demo'},
            {label: 'Schema', value: 'schema'},
            {label: 'UI Schema', value: 'uischema'},
            {label: 'Data', value: 'data'},
          ]}>
          <DemoTab value="demo">
            <ThemeProvider theme={theme}>
              <JsonForms
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data }) => setData(data)}
                i18n= {i18n}
                {...props}
              />
            </ThemeProvider>
          </DemoTab>
          <TabItem value="schema">
            <Code name="schema.json">{schema}</Code>
          </TabItem>
          <TabItem value="uischema">
            <Code name="uischema.json">{uischema}</Code>
          </TabItem>
          <TabItem value="data">
            <Code>{data}</Code>
          </TabItem>
        </TabsContainer>
      </TabsWrapper>
    </ThemeProvider>
  );
};

export default Demo;

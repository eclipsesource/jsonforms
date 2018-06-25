import * as React from 'react';
import { TreeRenderer } from './tree/TreeRenderer';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#ee6e73',
      dark: '#26a69a'
    }
  }
});

const EditorIde = props => {
  const { uischema, schema, filterPredicate, labelProvider, imageProvider} = props;
  const editor: {[x: string]: any} = {
    margin: 'auto',
    width: '100%'
  };
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <TreeRenderer
          className={editor}
          uischema={uischema}
          schema={schema}
          filterPredicate={filterPredicate}
          labelProvider={labelProvider}
          imageProvider={imageProvider}
        />
      </div>
    </MuiThemeProvider>
  );
};

export default EditorIde;

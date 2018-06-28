import * as React from 'react';
import { TreeRenderer } from './tree/TreeRenderer';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#ee6e73',
      dark: '#26a69a'
    }
  }
});

const styles = {
  editor: {
    margin: 'auto',
    width: '100%'
  },
};

const EditorIde = props => {
  const { classes, uischema, schema, filterPredicate, labelProvider, imageProvider} = props;
  return (
    <MuiThemeProvider theme={theme}>
        <TreeRenderer
          className={classes.editor}
          uischema={uischema}
          schema={schema}
          filterPredicate={filterPredicate}
          labelProvider={labelProvider}
          imageProvider={imageProvider}
        />
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(EditorIde);

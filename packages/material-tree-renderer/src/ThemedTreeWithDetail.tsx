import * as React from 'react';
import { TreeWithDetailRenderer } from './tree/TreeWithDetailRenderer';
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
  treeWithDetail: {
    margin: 'auto',
    width: '100%'
  },
};

const ThemedTreeWithDetail = props => {
  const { classes, uischema, schema, filterPredicate, labelProvider, imageProvider} = props;
  return (
    <MuiThemeProvider theme={theme}>
        <TreeWithDetailRenderer
          className={classes.treeWithDetail}
          uischema={uischema}
          schema={schema}
          filterPredicate={filterPredicate}
          labelProvider={labelProvider}
          imageProvider={imageProvider}
        />
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(ThemedTreeWithDetail);

import * as React from 'react';
import TreeWithDetailRenderer, { TreeWithDetailProps } from './tree/TreeWithDetailRenderer';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#ee6e73',
            dark: '#26a69a'
        }
    }
});

const ThemedTreeWithDetail = (props: TreeWithDetailProps) => {
    return (
        <MuiThemeProvider theme={theme}>
            <TreeWithDetailRenderer {...props}
            />
        </MuiThemeProvider>
    );
};

export default ThemedTreeWithDetail;

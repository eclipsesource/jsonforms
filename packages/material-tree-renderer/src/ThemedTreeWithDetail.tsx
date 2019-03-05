import React from 'react';
import TreeWithDetailRenderer from './tree/TreeWithDetailRenderer';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#ee6e73',
            dark: '#26a69a'
        }
    }
});

const ThemedTreeWithDetail = (props: any) => {
    return (
        <MuiThemeProvider theme={theme}>
            <TreeWithDetailRenderer {...props}/>
        </MuiThemeProvider>
    );
};

export default ThemedTreeWithDetail;

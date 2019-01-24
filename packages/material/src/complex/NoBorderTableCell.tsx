import { withStyles } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';
import React from 'react';

const styles = {
    noBottomBorder: {
        borderBottom: 'none'
    }
};

const NoBorderTableCell = ({ classes, children, ...otherProps }: any) => (
    <TableCell className={classes.noBottomBorder} {...otherProps}>
        {children}
    </TableCell>
);

export default withStyles(styles)(NoBorderTableCell);

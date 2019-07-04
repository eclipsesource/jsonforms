/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import React from 'react';

import Badge from '@material-ui/core/Badge';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Tooltip from '@material-ui/core/Tooltip';
import {
  StyledComponentProps,
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import { compose } from 'redux';

export { StyledComponentProps };
const styles = createStyles(({ palette }: Theme) => ({
  badge: {
    color: palette.error.main
  }
}));

export interface ValidationProps {
  errorMessages: string;
  id: string;
}

const ValidationIcon: React.SFC<ValidationProps & WithStyles<'badge'>> =
  ({ classes, errorMessages, id }) => {
    return (
      <Tooltip
        id={id}
        title={errorMessages}
      >
        <Badge className={classes.badge} badgeContent={errorMessages.split('\n').length}>
          <ErrorOutlineIcon color='inherit'/>
        </Badge>
      </Tooltip>
    );
};

export default compose(
  withStyles(styles, { name: 'ValidationIcon' })
)(ValidationIcon);

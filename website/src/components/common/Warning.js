import React from 'react';
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Info from '@material-ui/icons/Info';
import commonStyles from "./styles";

const styles = {
  alert: {
    width: '100%',
    height: '100%'
  },
  container: commonStyles.warningContainer
};

const Warning = ({ classes, children }) => (
  <Grid container className={classes.container}>
    <Grid item xs={1}>
      <Info className={classes.alert} />
    </Grid>
    <Grid item xs={11}>
      {children}
    </Grid>
  </Grid>
);

export default withStyles(styles)(Warning);

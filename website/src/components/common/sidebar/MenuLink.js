import React from 'react';
import { Link } from "docz";
import { withStyles } from '@material-ui/core';

const styles = {
  selected: {
    borderLeft: "3px solid #f44336",
    marginRight: "0.25rem",
    paddingLeft: "0.25rem",
    fontWeight: "bold",
  }
};

const MenuLink = ({ classes, to, pathname, label }) => {
  if (to === pathname) {
    return (
      <Link to={to}>
        <span className={classes.selected} style={{ color: '#000' }}>{label}</span>
      </Link>
    )
  }
  return <Link to={to} style={{ color: '#000' }}>{label}</Link>
}

export default withStyles(styles)(MenuLink);
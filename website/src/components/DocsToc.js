import React from 'react';
import { withStyles } from '@material-ui/core';
import { Link, useMenus } from 'docz';
import _ from 'lodash';
import { groupByParent } from '../common/menus';
import styles from "../styles/global.module.css"

const additionalStyles = {
  toc: {
    listStyleType: 'none',
    fontSize: '1.25rem',
    marginLeft: 0
  },
  heading: {
    fontWeight: 600,
    fontSize: 48,
    margin: "40px 0 20px",
    justifyContent: 'flex-start'
  },
  container: {
    margin: '0 auto'
  }
};

const DocsToc = ({ classes }) => {
  const toc = groupByParent(useMenus({ filter: m => m.route.startsWith('/docs/')}))
  return (
    <div className={styles.main}>
      <div className={classes.container}>
        <h1 className={classes.heading}>Documentation</h1>
        <ul className={classes.toc}>
          {toc.map(m => (
            <li key={m.route}>
              <Link to={m.route}>{m.name}</Link>
            </li>
          ))}
          <li>
            <Link to="/docs/api">API Documentation</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default withStyles(additionalStyles)(DocsToc);

import React from 'react';
import { withStyles } from '@material-ui/core';
import { useMenus } from 'docz';
import _ from 'lodash';
import MenuLink from './common/sidebar/MenuLink';
import styles from '../styles/global.module.css';
import hiddenPageRoutes from '../pages/hiddenPageRoutes';

const additionalStyles = {
  toc: {
    listStyleType: 'none',
    fontSize: '1.25rem',
    marginLeft: 0,
  },
  heading: {
    fontWeight: 600,
    fontSize: 48,
    margin: '40px 0 20px',
    justifyContent: 'flex-start',
  },
  container: {
    margin: '0 auto',
  },
};

const baseIndent = 15;
const baseFontSize = 22;

const Menu = ({ indent, menu }) => {
  const children = useMenus({
    filter: (m) =>
      !hiddenPageRoutes.includes(m.route) && m.parent === menu.name,
  });
  const style = {
    paddingLeft: indent * baseIndent,
    fontSize: baseFontSize - indent * 4 - indent,
    listStyleType: 'none',
  };
  if (children) {
    return (
      <li style={style}>
        <MenuLink to={menu.route} label={menu.name} />
        <ul style={style}>
          {children.map((m) => (
            <Menu key={m.id} indent={indent + 1} menu={m} />
          ))}
        </ul>
      </li>
    );
  } else {
    return (
      <li key={menu.id} style={style}>
        <MenuLink to={menu.route} label={menu.name} />
      </li>
    );
  }
};

const DocsToc = ({ classes }) => {
  const toc = useMenus({
    filter: (m) =>
      m.route.startsWith('/docs/') &&
      !hiddenPageRoutes.includes(m.route) &&
      !m.parent,
  });
  return (
    <div className={styles.main}>
      <div className={classes.container}>
        <h1 className={classes.heading}>Documentation</h1>
        <ul className={classes.toc}>
          {toc.map((m) => (
            <Menu key={m.route} menu={m} indent={0} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default withStyles(additionalStyles)(DocsToc);

import React from 'react';
import { withStyles } from '@material-ui/core';
import styles from '../../../styles/global.module.css'
import MenuLink from './MenuLink';

const additionalStyles = {
    container: {
        display: 'flex',
        paddingBottom: 10
    }
}

const baseIndent = 5;
const baseFontSize = 22;

const Menu = ({ indent, menu, pathname }) => {
  const style = {
    paddingLeft: indent * baseIndent,
    fontSize: baseFontSize - indent * 2,
  };
  if (menu.menu) {
    return (
      <li style={style}>
        <MenuLink to={menu.route} label={menu.name} pathname={pathname} />
        <ul style={style}>
          {menu.menu.map(m => (
            <Menu
              key={m.route}
              indent={indent + 1}
              menu={m}
              pathname={pathname}
            />
          ))}
        </ul>
      </li>
    );
  } else {
    return (
      <li key={menu.id} style={style}>
        <MenuLink to={menu.route} label={menu.name} pathname={pathname} />
      </li>
    );
  }
}

const SidebarLayout = ({ classes, children, menus, pathname }) => (
  <div className={classes.container}>
    <ul className={styles.sidebar}>
      {menus.map(m => (
        <Menu key={m.route} menu={m} pathname={pathname} indent={0} />
      ))}
    </ul>
    <div className={styles.main}>
      <div className={styles.main_inner}>{children}</div>
    </div>
  </div>
);

export default withStyles(additionalStyles)(SidebarLayout);
import React, { useState, useEffect } from "react";
import { useMenus, Link } from "docz";
import withStyles from "@material-ui/core/styles/withStyles";
import { groupByParent } from "../common/menus";
import SidebarLayout from "./common/sidebar/SidebarLayout";
import { Button } from "@material-ui/core";
import styles from "../styles/global.module.css";

const DocPage = ({ children, pathname }) => {
  const [menus, setMenus] = useState([]);
  const doczMenus = useMenus({ filter: m => m.route.startsWith('/docs/') });
  useEffect(() => {
    setMenus(groupByParent(doczMenus));
  }, [])
  return (
    <SidebarLayout menus={menus} pathname={pathname}>
      {children}
      <Button variant="outlined" component={Link} to='/docs' className={styles.toc_button}>
        Back to Overview
      </Button>
    </SidebarLayout>
  );
}

export default withStyles({
  link: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: '1.25rem'
  }
})(DocPage);

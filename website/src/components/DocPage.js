import React, { Fragment } from "react";
import { useMenus, Link } from "docz";
import withStyles from "@material-ui/core/styles/withStyles";
import SidebarLayout from "./common/sidebar/SidebarLayout";
import { Button } from "@material-ui/core";
import styles from "../styles/global.module.css";

const DocPage = ({ children, pathname }) => {
  const menus = useMenus({
    filter: m => m.route.startsWith('/docs/') && !m.parent,
  });
  return (
    <Fragment>
      <SidebarLayout menus={menus} pathname={pathname}>
        {children}
        <Button variant="outlined" component={Link} to='/docs' className={styles.toc_button}>
          Back to Overview
      </Button>
      </SidebarLayout>
    </Fragment>
  );
}

export default withStyles({
  link: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: '1.25rem'
  }
})(DocPage);

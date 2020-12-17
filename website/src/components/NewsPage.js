import React, { useState, useEffect } from "react";
import { Link, useMenus } from "docz";
import Button from "@material-ui/core/Button";
import SidebarLayout from "./common/sidebar/SidebarLayout";
import styles from "../styles/global.module.css";

const NewsPage = ({ children, pathname }) => {
  const [menus, setMenus] = useState([]);
  const doczMenus = useMenus({ filter: m => m.route.startsWith('/news/') });
  useEffect(() => setMenus(doczMenus), []);
  return (
    <SidebarLayout menus={menus} pathname={pathname}>
      { children}
      < Button
        variant="outlined"
        component={Link}
        to="/news"
        className={styles.toc_button}
      >
        Back to Overview
      </Button >
    </SidebarLayout >
  );
}

export default NewsPage;

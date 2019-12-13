import { Link } from "docz"
import PropTypes from "prop-types"
import React from "react"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Logo from './Logo';
import globalStyles from '../styles/global.module.css';
import styles from './header.module.css';

const additionalStyles = theme => ({
  root: {
    width: '100%',
  },
  appBar: {
    minHeight: '5vh',
    margin: 0,
    backgroundColor: '#212121',
    boxShadow: 'none',
    paddingLeft: 10,
    paddingRight: 10
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  logo: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const Header = ({ classes }) => (
  <AppBar className={classes.appBar} position="relative">
    <Toolbar style={{ padding: 0 }}>
      <Link to="/" className={styles.logo__icon}>
        <Logo width={45} height={30} color="#fff" alt="JSON Forms Logo" />
      </Link>
      &nbsp;
      <Link to="/" className={styles.logo__title}>
        <Typography variant="body1" color="inherit">
          JSON Forms
        </Typography>
      </Link>
      <Link to="/examples" className={globalStyles.nav__link}>
        Examples
      </Link>
      <Link to="/docs" className={globalStyles.nav__link}>
        Docs
      </Link>
      <Link to="/faq" className={globalStyles.nav__link}>
        FAQ
      </Link>
      <Link
        to="/support"
        className={[
          globalStyles.nav__link,
          globalStyles.navbar__support_link
        ].join(" ")}
      >
        Professional Support
      </Link>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(additionalStyles)(Header)

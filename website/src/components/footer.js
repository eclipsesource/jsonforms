import React from 'react';
import {Link} from "docz"
import withStyles from "@material-ui/core/styles/withStyles";
import corePackageJson from '@jsonforms/core/package'
import globalStyles from '../styles/global.module.css';
import styles from './footer.module.css';

const additionalStyles = () => ({
  link: {
    paddingLeft: '1em'
  }
});

const Footer = ({classes}) => {
  const linkClasses = [classes.link, globalStyles.link].join(' ');
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__version_and_copyright}>
        <span>
          Version {corePackageJson.version}
        </span>
        <span className={styles.footer__version_and_copyright_copyright}>
          © EclipseSource 2019
        </span>
      </div>
      <div className={styles.footer__links}>

        <a href="https://github.com/eclipsesource/jsonforms" className={linkClasses}>
          Github
        </a>

        <a href="https://twitter.com/JSONForms" className={linkClasses}>
          Twitter
        </a>

        <a href="https://eclipsesource.com/blogs/tag/jsonforms/" className={linkClasses}>
          Blog
        </a>

        <Link to="/imprint" className={linkClasses}>
          Imprint
        </Link>

        <Link to="/privacy-policy" className={linkClasses}>
          Privacy Policy
        </Link>

        <Link to="/cookie-policy" className={linkClasses}>
          Cookie Policy
        </Link>
      </div>
    </footer>
  );
}

export default withStyles(additionalStyles)(Footer);

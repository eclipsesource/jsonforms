import React from 'react';
import { Link } from "docz"
import withStyles from "@material-ui/core/styles/withStyles";
import corePackageJson from '@jsonforms/core/package'
import globalStyles from '../styles/global.module.css';
import styles from './footer.module.css';

const additionalStyles = () => ({
  link: {
    paddingLeft: '1em'
  }
});

const Footer = ({ classes }) => {
  const linkClasses = [classes.link, globalStyles.link].join(' ');
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__version_and_copyright}>
        <span>
          Version {corePackageJson.version}
        </span>
        <span className={styles.footer__version_and_copyright_copyright}>
          © EclipseSource 2020
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

        <a href="https://eclipsesource.com/imprint/" className={linkClasses}>
          Imprint
        </a>

        <a href="https://www.iubenda.com/privacy-policy/83048734" className={linkClasses}>
          Privacy Policy
        </a>

        <a href="https://www.iubenda.com/privacy-policy/83048734/cookie-policy" className={linkClasses}>
          Cookie Policy
        </a>
      </div>
    </footer>
  );
}

export default withStyles(additionalStyles)(Footer);

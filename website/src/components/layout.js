import React, { useEffect } from "react"
import PropTypes from "prop-types"

import Header from "./header"
import Footer from "./footer"
//import './layout.module.css'
import styles from '../styles/global.module.css'

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import {createMuiTheme} from "@material-ui/core"
import DocPage from "./DocPage";
import ExamplesPage from "./ExamplesPage";
import { Location } from "@reach/router";

const defaultTheme = createMuiTheme()
const { breakpoints } = defaultTheme;

const theme = {
  ...defaultTheme,
  overrides: {
    MuiTypography: {
      h1: {
        fontSize: "5rem",
        lineHeight: 1.25,
        [breakpoints.down("xs")]: {
          fontSize: "3rem"
        }
      },
      h2: {
        fontSize: "2.5rem",
        lineHeight: 1.5,
        [breakpoints.down("xs")]: {
          fontSize: "2rem"
        }
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 'bold',
        lineHeight: 1.5,
        [breakpoints.down("xs")]: {
          fontSize: "1.5rem"
        }
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 'bold',
        lineHeight: 1.5,
        [breakpoints.down("xs")]: {
          fontSize: "1.25rem"
        }
      },
      body1: {
        fontSize: "1.2rem",
        [breakpoints.down("xs")]: {
          fontSize: "1.2rem"
        }
      },
      body2: {
        fontSize: "1.2rem",
        fontWeight: 'bold',
        [breakpoints.down("xs")]: {
          fontSize: "1.2rem"
        }
      },
      caption: {
        fontSize: "1rem",
        [breakpoints.down("xs")]: {
          fontSize: "1rem"
        }
      }
    }
  }
};

const Layout = ({ children, ...props }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <main className={styles.content}>{children}</main>
      <Footer />
    </MuiThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

const LocationAwareLayout = ({ children }) => {
  return (
    <Location>
      {({ location }) => {
        if (location.pathname.startsWith('/docs/')) {
          return (
            <Layout>
                <DocPage pathname={location.pathname}>
                  {children}
                </DocPage>
            </Layout>
          )
        } else if (location.pathname.startsWith('/examples/')) {
          return (
            <Layout>
                <ExamplesPage pathname={location.pathname}>
                  {children}
                </ExamplesPage>
            </Layout>
          )
        } else {
          return (
            <Layout>
              {children}
            </Layout>
          )
        }
      }}
    </Location>
  )
}

export default LocationAwareLayout;

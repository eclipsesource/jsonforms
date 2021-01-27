import * as React from 'react';
import { Link } from 'docz';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import FeaturesIcon from '@material-ui/icons/Report';
import CustomizeIcon from '@material-ui/icons/Brush';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import corePackageJson from '@jsonforms/core/package';
import { Provider } from 'react-redux';
import angularLogo from '../images/angular.svg';
import reactLogo from '../images/react-logo.svg';
import vueLogo from '../images/vue-logo.svg';
import architectureSmall from '../images/architecture_small.svg';
import schema from './schema.json';
import uischema from './uischema.json';
import tweets from '../pages/news/tweets.json';
import schemaLogo from './schemalogo.svg';
import { NewsSection } from './NewsSection';

import { Demo, Logo } from '../components/common';
import { createJsonFormsStore } from '../common/store';
import globalStyles from '../styles/global.module.css';
import styles from './home.module.css';
import { Grid } from '@material-ui/core';

const additionalStyles = () => ({
  logo: {
    textAlign: 'center',
    marginTop: '0.5em',
    paddingBottom: '0.5em',
    fontSize: '2em',
  },
  gettingStartedButton: {
    margin: '1em',
  },
});

const store = createJsonFormsStore({
  data: { firstName: 'Max', lastName: 'Power' },
  schema,
  uischema,
});

const nextVersion = process.env.DOCZ_NEXTVERSION;
const nextVersionText =
  nextVersion && nextVersion !== corePackageJson.version
    ? `@next: ${nextVersion}`
    : '';

const Home = ({ classes }) => {
  return (
    <React.Fragment>
      <div className={classes.logo}>
        <div style={{ paddingTop: '0.5em' }}>
          <Grid container>
            <Grid item sm={4} md={4}></Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant='h2'>
                <strong>JSON</strong>Forms
              </Typography>
              <Logo />
              <Typography variant='h5'>More forms. Less code.</Typography>
              <div className={styles.feature}>
                <Typography variant='h6' style={{ color: '#747474' }}>
                  Complex forms in the blink of an eye
                </Typography>
              </div>
              <div className={styles.feature}>
                <Typography>
                  Version: {corePackageJson.version}
                  {nextVersionText && (
                    <>
                      <br />
                      {nextVersionText}
                    </>
                  )}
                </Typography>
              </div>
              <div className={styles.feature}>
                <Link to='/docs/getting-started' className={globalStyles.link}>
                  <Button
                    variant='outlined'
                    className={classes.gettingStartedButton}
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className={styles.landing_page__features}>
        <div className={styles.feature}>
          <img src={schemaLogo} className={styles.schemaLogo} />
          <p className={styles.landing_page__detail}>
            Declare your forms as JSON based on a JSON Schema
          </p>
        </div>

        <div className={styles.feature}>
          <FeaturesIcon className={styles.icon} />
          <p className={styles.landing_page__detail}>
            Fully-featured forms including data-binding, input validation, and
            rule-based visibility out-of-the-box
          </p>
        </div>

        <div className={styles.feature}>
          <CustomizeIcon className={styles.icon} />
          <p className={styles.landing_page__detail}>
            Designed for customizability - from custom styling to custom widgets
          </p>
        </div>
      </div>

      <div className={styles.landing_page__description}>
        <div className={styles.landing_page__logos}>
          <img
            src={reactLogo}
            alt='React logo'
            style={{ height: '80px', width: '80px' }}
          />

          <img
            src={angularLogo}
            alt='Angular logo'
            style={{ height: '80px', paddingLeft: '5px' }}
          />

          <img
            src={vueLogo}
            alt='Vue logo'
            style={{ height: '70px', paddingLeft: '5px' }}
          />
        </div>
        <Typography
          variant='h4'
          style={{ color: '#212121', textAlign: 'center' }}
        >
          JSON Forms is a JSON Schema based approach for creating forms.
          <br />
          It comes with off the shelf support for React, Angular and Vue.
        </Typography>
      </div>

      <div className={styles.landing_page__form}>
        <Provider store={store}>
          <JsonFormsReduxContext>
            <Demo
              js={() => <JsonFormsDispatch />}
              schema={schema}
              uischema={uischema}
            />
          </JsonFormsReduxContext>
        </Provider>
      </div>

      <hr />

      <div className={styles.landing_page__news}>
        <div className={styles.news_section}>
          <NewsSection tweets={tweets} amount='1' />
        </div>
        <Link to='/news' className={globalStyles.link}>
          <Button variant='contained'>more news</Button>
        </Link>
      </div>

      <div className={styles.landing_page__architecture}>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={12}>
            <Typography
              variant='h3'
              align='center'
              className={styles.shift_left}
            >
              JSON Forms Architecture
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={5}
          alignItems='center'
          justify='center'
          mt={4}
          className={styles.landing_page__architecture_inner}
        >
          <Grid item xs={12} lg={6}>
            <Link to='/docs/architecture'>
              <img
                src={architectureSmall}
                alt='JSON Forms Architecture'
                className={styles.architecture_small}
              />
            </Link>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                JSON Forms has a modular architecture and can be customized on
                every level. The core functionality is pure Javascript and
                therefore independent from any UI framework. We offer bindings
                for React, Angular and Vue. For more information see{' '}
                <Link to='/docs/architecture'>here</Link>.
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default withStyles(additionalStyles)(Home);

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../../../content/pages/assets/index.module.css';
import corePackageJson from '@jsonforms/core/package';
import { currentVersion, nextVersion } from '../../../static/current-version';

import SchemaIcon from '../../../static/img/schemaIcon.svg';
import FeaturesIcon from '@mui/icons-material/Report';
import CustomizeIcon from '@mui/icons-material/Brush';
import ArchitectureSmall from '../../../static/img/architecture_small.svg';
import AngularLogo from '../../../static/img/angular-logo.svg';
import ReactLogo from '../../../static/img/react-logo.svg';
import VueLogo from '../../../static/img/vue-logo.svg';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { Demo } from '../common/Demo';
import schema from '../../../content/pages/assets/schema.json';
import uischema from '../../../content/pages/assets/uischema.json';

const data = { firstName: 'Max', lastName: 'Power' };

function Home({ recentPosts }) {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const recentPost = recentPosts[0];
  const { BlogPost } = recentPost;

  const currentVersionText = 
    `Version: ${currentVersion ? currentVersion : corePackageJson.version}`;

  const nextVersionText =
    nextVersion && nextVersion !== currentVersion
      ? `@next: ${nextVersion}`
      : '';

  return (
    <Layout
      title={siteConfig.tagline}
      description={siteConfig.tagline}>
      <div className={styles.home}>
        <header className={clsx('hero', styles.heroBanner)}>
          <div className="container">
            <h1 className="hero__title"><b>JSON</b>Forms</h1>
            <img className={styles.logo} src='img/logo.svg' />
            <p className={styles.subtitle}>{siteConfig.tagline}</p>
            <p className={styles.subsubtitle}>Complex forms in the blink of an eye</p>
            <div className={styles.versionwrapper}>
              <p className={styles.version}>{currentVersionText}</p>
              <p className={styles.nextversion}>{nextVersionText}</p>
            </div>
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  'button button--outline button--secondary button--lg',
                  styles.getStarted,
                )}
                to={useBaseUrl('docs/getting-started')}>
                Get Started
              </Link>
            </div>
          </div>
        </header>
        <main>
          <section className={styles.sectionFeatures}>
            <div className="container">
              <div className="row">
                <div className={clsx('col col--4', styles.feature)}>
                  <div className="text--center">
                    <SchemaIcon className={styles.featureIcon} />
                  </div>
                  <p>Declare your forms as JSON based on a JSON Schema</p>
                </div>
                <div className={clsx('col col--4', styles.feature)}>
                  <div className="text--center">
                    <FeaturesIcon className={styles.featureIcon} />
                  </div>
                  <p>Fully-featured forms including data-binding, input validation, and rule-based visibility out-of-the-box</p>
                </div>
                <div className={clsx('col col--4', styles.feature)}>
                  <div className="text--center">
                    <CustomizeIcon className={styles.featureIcon} />
                  </div>
                  <p>Designed for customizability - from custom styling to custom widgets</p>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.sectionDemo}>
            <div className={styles.frameworkLogos}>
              <ReactLogo/>
              <AngularLogo/>
              <VueLogo/>
            </div>
            <h3>JSON Forms is a JSON Schema based approach for creating forms. <br/>It comes with off the shelf support for React, Angular and Vue.</h3>
            <div className={styles.demoContent}>
              <Demo schema={schema} uischema={uischema} data={data} />
            </div>
          </section>
          <hr/>
          <section className={styles.sectionNews}>
            <Card className={styles.newsCard}>
              <CardContent>
                <BlogPost />
                <span style={{ display: 'block', textAlign: 'right', width: '100%'}}>{recentPost.metadata.formattedDate}</span>
              </CardContent>
            </Card>
            <Link to='/news' className={styles.newsButton}>
              <Button variant='contained'>more news</Button>
            </Link>
          </section>
          <section className={styles.sectionArchitecture}>
            <h2>JSON Forms Architecture</h2>
            <div className={styles.sectionArchitectureContent}>
              <Link
                to='/docs/architecture'
                className={styles.architectureDiagram}
              >
                <ArchitectureSmall className={styles.architecture_small} />
              </Link>
              <Card>
                <CardContent>
                  JSON Forms has a modular architecture and can be customized on
                  every level. The core functionality is pure Javascript and
                  therefore independent from any UI framework. We offer bindings
                  for React, Angular and Vue. For more information see{' '}
                  <Link to='/docs/architecture'>here</Link>.
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

export default Home;

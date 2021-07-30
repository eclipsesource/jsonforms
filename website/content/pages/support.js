import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './assets/support.module.scss';

function Support() {
  return (
    <Layout
      title="Professional Support"
      description="Description will go into a meta tag in <head />">
      <div className='support__main' style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <div className={styles.comparison_container} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
          <div className={styles.community} style={{flex: '1'}}>
            <h3 className={styles.comparison_title}>Community support</h3>
            <ul className={styles.list} style={{listStylePosition: 'inside'}}>
              <li className={styles.list_item}><a className={styles.link} href={'https://jsonforms.discourse.group'}>Public channel</a></li>
              <li className={styles.list_item}>Basic topics only</li>
              <li className={styles.list_item}>Longer response time</li>
            </ul>
            <div className={styles.free_block}>
              Free
            </div>
          </div>
          <div className={styles.professional} style={{flex: '1'}}>
            <h3 className={styles.comparison_title}>Professional Support</h3>
            <ul className={styles.list} style={{listStylePosition: 'inside'}}>
              <li className={styles.list_item}>Guaranteed response time</li>
              <li className={styles.list_item}>In-depth answers</li>
              <li className={styles.list_item}>Code examples</li>
              <li className={styles.list_item}>Advanced topics covered</li>
              <li className={styles.list_item}>Private channel available (NDA)</li>
              <li className={styles.list_item}>Feature prioritization</li>
            </ul>
            <div className={styles.details_block}>
              For details please see <a className={styles.link} href={'https://eclipsesource.com/services/developer-support/'}>here</a>.
            </div>
          </div>
        </div>
        <img alt="EclipseSource Logo" src={useBaseUrl('img/eclipsesource.png')} className='es-logo' style={{display:'block', marginLeft: 'auto', marginRight: 'auto'}}/>
      </div>
    </Layout>
  );
}

export default Support;
import React from 'react';
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import eclipseSourceLogo from './eclipsesource.png';

const styles = () => ({
  comparison_container: {
    margin: '2rem 0 0 0',
    padding: '2rem 1rem 2rem 1rem'
  },
  comparison_title: {
    color: 'white',
    margin: '1rem 2rem 3rem 4rem'
  },
  community: {
    backgroundColor: '#1C4587',
    borderRadius: '0px 60px 0px 60px',
    color: 'white',
    padding: '2rem 1rem 2rem 1rem',
    minWidth: '32rem',
    maxWidth: '32rem'
  },
  professional: {
    backgroundColor: '#6D9CCD',
    borderRadius: '60px 0px 60px 0px',
    color: 'white',
    padding: '2rem 1rem 2rem 1rem',
    minWidth: '32rem',
    maxWidth: '32rem'
  },
  list: {
    margin: '0 2rem 0 2rem'
  },
  list_item: {
    color: 'white',
    fontSize: '1.4rem'
  },
  free_block: {
    margin: '8.5rem 2rem 0 2rem',
    textAlign: 'center',
    fontSize: '1.4rem'
  },
  price_block: {
    margin: '2rem 0 0 2rem',
    fontSize: '1.4rem'
  },
  price_list_item: {
    color: 'white',
    fontSize: '1.2rem',
    '&:before': {
      content: '"\\2192"',
      paddingRight: '0.5em'
    }
  },
  link: {
    color: 'white',
    textDecoration: 'underline'
  }
});

const Support = ({ classes }) => (
  <div className='support__main' style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
    <div className={classes.comparison_container} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
      <div className={classes.community} style={{flex: '1'}}>
        <Typography className={classes.comparison_title} variant="h3">Community support</Typography>
        <ul className={classes.list} style={{listStylePosition: 'inside'}}>
          <li className={classes.list_item}><a className={classes.link} href={'https://spectrum.chat/jsonforms/'}>Public channel</a></li>
          <li className={classes.list_item}>Basic topics only</li>
          <li className={classes.list_item}>Longer response time</li>
        </ul>
        <div className={classes.free_block}>
          Free
        </div>
      </div>
      <div className={classes.professional} style={{flex: '1'}}>
        <Typography className={classes.comparison_title} variant="h3">Professional Support</Typography>
        <ul className={classes.list} style={{listStylePosition: 'inside'}}>
          <li className={classes.list_item}>Guaranteed response time</li>
          <li className={classes.list_item}>In-depth answers</li>
          <li className={classes.list_item}>Code examples</li>
          <li className={classes.list_item}>Advanced topics covered</li>
          <li className={classes.list_item}>Private channel available (NDA)</li>
          <li className={classes.list_item}>Feature prioritization</li>
        </ul>
        <div className={classes.price_block}>
          Starts from 1.695 €: <a className={classes.link} href={'mailto:support@jsonforms.io'}>Contact us</a> for details
          <ul className={classes.list} style={{listStylePosition: 'inside', listStyle:'none'}}>
            <li className={classes.price_list_item}>10h professional support</li>
            <li className={classes.price_list_item}>additionally 5h project sponsorship</li>
          </ul>
        </div>
      </div>
    </div>
    <img alt="EclipseSource Logo" src={eclipseSourceLogo} className='es-logo' style={{display:'block', marginLeft: 'auto', marginRight: 'auto'}}/>
  </div>
);

export default withStyles(styles)(Support);

import React from 'react';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Feedback from '@material-ui/icons/Feedback'
import Build from '@material-ui/icons/Build'
import School from '@material-ui/icons/School'
import Swap from '@material-ui/icons/SwapVerticalCircle'
import Chat from '@material-ui/icons/Chat'
import LocalOffer from '@material-ui/icons/LocalOffer'
import eclipseSourceLogo from './eclipsesource.png';
import EmailIcon from '@material-ui/icons/Email';

const styles = () => ({
  grid: {
    paddingTop: '1em'
  },
  icon: {
    width: 'auto',
    height: '6em',
    display: 'flex',
    alignItems: 'center',
    color: '#413f3f'
  },
  title: {
    margin: '0.5em',

  }
});

const Support = ({ classes }) => (
  <div className='examples__main'>
    <div className='examples__main-inner' style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" style={{ textAlign: 'center', color: '#413f3f' }}>Professional Support is brought to you by</Typography>
      <img alt="EclipseSource Logo" src={eclipseSourceLogo} className='es-logo'/>
      <Feedback className={classes.icon}/>
      <Typography variant='h3' className={classes.title}>
        Evaluation
      </Typography>
      <Typography variant='body1'>
        Let us help to decide, whether JSON Forms is the right choice for you. We will evaluate your requirements, assess if and how they can be matched with JSON Forms, and help you to estimate the integration effort
      </Typography>

      <Build className={classes.icon}/>
      <Typography variant='h3' className={classes.title}>
        Prototyping
      </Typography>
      <Typography variant='body1'>
        Let us provide you with a prototype demonstrating how JSON Forms will work in your domain
      </Typography>

      <School className={classes.icon}/>
      <Typography variant='h3' className={classes.title}>
        Training
      </Typography>
      <Typography variant='body1'>
        Let us teach you how to apply JSON Forms most efficient in your project, including related technologies such as React or JSON Schema.
      </Typography>


      <Swap className={classes.icon}/>
      <Typography variant='h3' className={classes.title}>
        Integration
      </Typography>
      <Typography variant='body1'>
        Let us help you to integrate JSON Forms into your existing application as efficiently as possible
      </Typography>

      <Chat className={classes.icon}/>
      <Typography variant='h3' className={classes.title}>
        Support
      </Typography>
      <Typography variant='body1'>
        Let us assist your team when solving day-to-day issues, such as technical problems or architecture decisions
      </Typography>

      <LocalOffer className={classes.icon}/>
      <Typography variant='h3' className={classes.title}>
        Sponsored Development
      </Typography>

      <Typography variant='body1'>
        Let us adapt and enhance the framework based on your specific requirements
      </Typography>

      <Button style={{ paddingTop: '1em', paddingBottom: '1em' }} color={'primary'} component={props => <a href='mailto:munich@eclipsesource.com' {...props}>Contact us</a>}>
        <EmailIcon/>
      </Button>

      <Typography variant='body1'style={{ paddingBottom: '1em' }}>
        for more details!
      </Typography>
    </div>
  </div>
);

export default withStyles(styles)(Support);

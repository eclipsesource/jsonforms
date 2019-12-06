import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';
import DataIcon from '@material-ui/icons/Code';
import SchemaIcon from '@material-ui/icons/Description';
import UiSchemaIcon from '@material-ui/icons/ViewQuilt';
import { getData } from '@jsonforms/core';
import styles from '../../styles/global.module.css'

//
// Based on https://github.com/mui-org/material-ui/blob/v1-beta/docs/src/modules/components/Demo.js
//
const additionalStyles = theme => ({
  darkGrey: {
    color: 'rgba(45, 55, 71, 0.7)'
  },
  root: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      padding: `0 ${theme.spacing(1)}px`,
      marginLeft: 0,
      marginRight: 0,
    },
  },
  demo: theme.mixins.gutters({
    backgroundColor: theme.palette.background.contentFrame,
//    display: 'flex',
minWidth: '30vw',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(2),
    },
  }),
  code: {
    padding: 0,
    margin: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    '& pre': {
      overflow: 'auto',
      margin: '0px !important',
      borderRadius: '0px !important',
    },
  },
  schemaButton: {
    left: theme.spacing(2),
    right: theme.spacing(2),

  },
  uischemaButton: {
    left: theme.spacing(2),
    right: theme.spacing(2),
  },
  data: {
    left: theme.spacing(2),
    right: theme.spacing(2)
  },
});

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataOpen: props.js === undefined,
      schemaOpen: false,
      uischemaOpen: false,
    };
  }

  handleClickOpenSchema = () => {
    this.setState({
      schemaOpen: !this.state.schemaOpen,
      uischemaOpen: false,
      dataOpen: false,
    }, () => global.Prism.highlightAll());
  };

  handleClickOpenUiSchema = () => {
    this.setState({
      uischemaOpen: !this.state.uischemaOpen,
      schemaOpen: false,
      dataOpen: false,
    }, () => global.Prism.highlightAll());
  };

  handleClickOpenData = () => {
    this.setState({
      uischemaOpen: false,
      schemaOpen: false,
      dataOpen: !this.state.dataOpen
    }, () => global.Prism.highlightAll());
  };

  render() {
    const { classes, js: DemoComponent, schema, uischema, data } = this.props;
    const dataAsString = JSON.stringify(data, null, 2);
    const schemaAsString = JSON.stringify(schema, null, 2);
    const uiSchemaAsString = JSON.stringify(uischema, null, 2);
    const { schemaOpen, uischemaOpen, dataOpen } = this.state;

    return (
      <div>
        <div className={styles.demo__button_bar}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={schemaOpen ? 'Hide schema' : 'Show schema'} placement="top">
              <IconButton onClick={this.handleClickOpenSchema} className={classes.schemaButton}>
                <SchemaIcon className={classes.darkGrey} />
              </IconButton>
            </Tooltip>
            <Tooltip title={uischemaOpen ? 'Hide UI schema' : 'Show UI schema'} placement="top">
              <IconButton onClick={this.handleClickOpenUiSchema} className={classes.uischemaButton}>
                <UiSchemaIcon className={classes.darkGrey} />
              </IconButton>
            </Tooltip>
            <Tooltip title={dataOpen ? 'Hide data' : 'Show data'} placement="top">
              <IconButton onClick={this.handleClickOpenData} className={classes.data}>
                <DataIcon className={classes.darkGrey} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Collapse in={schemaOpen} unmountOnExit>
             <pre style={{ maxWidth: '80vw', backgroundColor: '#fff' }}>
               <code className="language-json" >
                 {schemaAsString}
               </code>
             </pre>
        </Collapse>

        <Collapse in={uischemaOpen} unmountOnExit>
          <pre style={{ maxWidth: '80vw', backgroundColor: '#fff' }}>
               <code className="language-json" >
                 {uiSchemaAsString}
               </code>
           </pre>
        </Collapse>

        <Collapse in={dataOpen} unmountOnExit>
          <pre style={{ maxWidth: '80vw', backgroundColor: '#fff' }}>
               <code className="language-json" >
                 {dataAsString}
               </code>
           </pre>
        </Collapse>

        {
          this.props.js &&
          <div className={classes.demo} >
            <DemoComponent/>
          </div>
        }
      </div>
    );
  }
}

Demo.propTypes = {
  classes: PropTypes.object.isRequired,
  js: PropTypes.func,
  schema: PropTypes.object.isRequired,
  uischema: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  data: getData(state),
});

export default connect(
  mapStateToProps
)(withStyles(additionalStyles)(Demo));

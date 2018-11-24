import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as _ from 'lodash';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FileDownload from '@material-ui/icons/GetApp';
import FolderOpen from '@material-ui/icons/FolderOpen';
import ImportExport from '@material-ui/icons/ImportExport';
import ModelSchemaDialog from './dialogs/ModelSchemaDialog';
import { Actions, getData, getSchema, JsonFormsState } from '@jsonforms/core';
import { createAjv } from '@jsonforms/core/lib/util/validator';

const ajv = createAjv();

const styles: StyleRulesCallback<'root' | 'flex' | 'rightIcon' | 'button'> = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  }
});

interface EditorBarProps {
  schema: any;
  rootData: any;
  updateRootData?: any;
}

interface EditorBarState {
  exportDialog: {
    open: boolean
  };
}

class EditorBar extends
  React.Component<EditorBarProps & WithStyles<'root' | 'flex' | 'rightIcon' | 'button'>,
                  EditorBarState> {
  constructor(props: EditorBarProps & WithStyles<'root' | 'flex' | 'rightIcon' | 'button'>) {
    super(props);
    this.state = {
      exportDialog: {
        open: false
      }
    };
  }

  handleExportDialogOpen = () => {
    this.setState({
      exportDialog: {
        open: true
      }
    });
  }

  handleExportDialogClose = () => {
    this.setState({
      exportDialog: {
        open: false
      }
    });
  }

  handleDownload = () => {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(this.props.rootData, null, 2)],
                          {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'download.json';
    a.click();
  }

  handleFileUpload = (event: React.SyntheticEvent<HTMLInputElement>) => {
    // triggered after a file was selected
    const schema = this.props.schema;
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (_.isEmpty(files) || files.length > 1) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();

    // Callback when the file was loaded
    reader.onload = () => {
      if (reader.result === undefined || reader.result === null) {
        console.error('Could not read data');
      }
      let readData;

      if (typeof reader.result === 'string') {
        try {
          readData = JSON.parse(reader.result);
        } catch (err) {
          console.error('The loaded file did not contain valid JSON.', err);
          alert(`The selected file '${file.name}' does not contain valid JSON`);

          return;
        }
      } else {
        console.error('Something went wrong! The file is an ArrayBuffer instead of a string.');
      }
      if (!_.isEmpty(readData)) {
        const valid = ajv.validate(schema, readData);
        if (valid) {
          this.props.updateRootData(readData);
        } else {
          alert('Loaded data does not adhere to the specified schema.');
          console.error('Loaded data does not adhere to the specified schema.');

          return;
        }
      }
    };

    reader.readAsText(file);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' color='inherit' className={classes.flex}>
              User and Task Editor
            </Typography>
            <Button component='label' className={classes.button} color='inherit'>
              Open Data File
              <FolderOpen className={classes.rightIcon} />
              <input
                onChange={this.handleFileUpload}
                style={{ display: 'none' }}
                type='file'
              />
            </Button>
            <Button
              className={classes.button}
              color='inherit'
              onClick={this.handleExportDialogOpen}
            >
              Export Model
              <ImportExport className={classes.rightIcon} />
            </Button>
            <ModelSchemaDialog
              open={this.state.exportDialog.open}
              onClose={this.handleExportDialogClose}
            />
            <Button className={classes.button} color='inherit' onClick={this.handleDownload}>
              Download Model
              <FileDownload className={classes.rightIcon} />
            </Button>

          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = (state: JsonFormsState) => {
  return {
    schema: getSchema(state),
    rootData: getData(state)
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  updateRootData(data: Object) {
    dispatch(Actions.update('', () => data));
  }
});

export default compose<any, any>(
  withStyles(styles, { name: 'EditorBar' }),
  connect(mapStateToProps, mapDispatchToProps)
)(EditorBar);

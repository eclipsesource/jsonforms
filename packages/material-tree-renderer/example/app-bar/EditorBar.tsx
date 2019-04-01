/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
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
  };

  handleExportDialogClose = () => {
    this.setState({
      exportDialog: {
        open: false
      }
    });
  };

  handleDownload = () => {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(this.props.rootData, null, 2)],
                          {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'download.json';
    a.click();
  };

  handleFileUpload = (event: React.SyntheticEvent<HTMLInputElement>) => {
    // triggered after a file was selected
    const schema = this.props.schema;
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (isEmpty(files) || files.length > 1) {
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
      if (!isEmpty(readData)) {
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
  };

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

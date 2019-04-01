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
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { getData, getUiSchema, JsonFormsState } from '@jsonforms/core';

const styles: StyleRulesCallback<'textarea'> = () => ({
  textarea: {
    width: 400,
    height: 600,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'normal',
    overflowX: 'scroll'
  }
});

interface ModelSchemaDialogProps {
  onClose: any;
  readOnly: boolean;
  open: boolean;
  fullScreen?: boolean;
  rootData?: any;
}

class ModelSchemaDialog extends
  React.Component<ModelSchemaDialogProps & WithStyles<'textarea'>, {}> {
  private textInput = createRef<HTMLInputElement>();

  handleCancel = () => {
    this.props.onClose();
  };

  handleCopy = () => {
    this.textInput.current.select();
    document.execCommand('copy');
  };

  render() {
    const { classes, fullScreen, open, rootData } = this.props;
    const textFieldData = JSON.stringify(rootData, null, 2);

    return (
      <Dialog open={open} fullScreen={fullScreen}>
        <DialogTitle id='model-schema-dialog'>
          Model Data
        </DialogTitle>
        <DialogContent>
          <TextField
            id='model-schema-textfield'
            className={classes.textarea}
            label='Model Data'
            multiline
            value={textFieldData}
            margin='normal'
            rowsMax={25}
            inputProps={{
              readOnly: true
            }}
            inputRef={this.textInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.handleCopy} color='primary'>
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: JsonFormsState, ownProps: any) => {
  const rootData = getData(state);

  return {
    rootData,
    classes: ownProps.classes,
    onClose: ownProps.onClose,
    open: ownProps.open,
    uischema: getUiSchema(state)
  };
};

export default compose<any, any>(
  withStyles(styles, { name: 'ModelSchemaDialog' }),
  withMobileDialog(),
  connect(mapStateToProps)
)(ModelSchemaDialog);

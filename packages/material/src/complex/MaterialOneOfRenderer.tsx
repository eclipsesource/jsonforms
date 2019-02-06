import React from 'react';

import {
  ControlProps,
  createDefaultValue,
  isOneOfControl,
  JsonSchema,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs
} from '@material-ui/core';
import { connect } from 'react-redux';
import { ResolvedJsonForms } from '@jsonforms/react';
import { createCombinatorRenderInfos, resolveSubSchemas } from './combinators';
import CombinatorProperties from './CombinatorProperties';

interface MaterialOneOfState {
  open: boolean;
  proceed: boolean;
  selectedOneOf: number;
  newOneOfIndex?: any;
}

interface OneOfProps {
  rootSchema: JsonSchema;
}

class MaterialOneOfRenderer extends React.Component<ControlProps & OneOfProps, MaterialOneOfState> {

  state: MaterialOneOfState = {
    open: false,
    proceed: false,
    selectedOneOf: 0,
    newOneOfIndex: 0
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  cancel = () => {
    this.setState({
      open: false,
      proceed: false
    });
  };

  confirm = () => {
    const { path, schema, handleChange } = this.props;
    handleChange(
      path,
      createDefaultValue(schema.oneOf[this.state.selectedOneOf])
    );
    this.setState({
      open: false,
      proceed: true,
      selectedOneOf: this.state.newOneOfIndex
    });
  };

  handleChange = (_event: any, newOneOfIndex: number) => {
    this.setState({
      open: true,
      newOneOfIndex
    });
  };

  render() {

    const oneOf = 'oneOf';
    const { schema, path, rootSchema } = this.props;
    const _schema = resolveSubSchemas(schema, rootSchema, oneOf);
    const oneOfRenderInfos = createCombinatorRenderInfos((_schema as JsonSchema).oneOf, rootSchema, oneOf);

    return (
      <React.Fragment>
        <CombinatorProperties
          schema={_schema}
          combinatorKeyword={'oneOf'}
          path={path}
        />
        <Tabs value={this.state.selectedOneOf} onChange={this.handleChange}>
          {oneOfRenderInfos.map(oneOfRenderInfo => <Tab key={oneOfRenderInfo.label} label={oneOfRenderInfo.label}/>)}
        </Tabs>
        {
          oneOfRenderInfos.map((oneOfRenderInfo, oneOfIndex) => (
            this.state.selectedOneOf === oneOfIndex && (
              <ResolvedJsonForms
                key={oneOfIndex}
                schema={oneOfRenderInfo.schema}
                uischema={oneOfRenderInfo.uischema}
                path={path}
              />
            )
          ))
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Clear form?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Your data will be cleared if you navigate away from this tab.
              Do you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancel} color='primary'>
              No
            </Button>
            <Button onClick={this.confirm} color='primary' autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );

  }
}

const ConnectedMaterialOneOfRenderer = connect(
  mapStateToControlProps,
  mapDispatchToControlProps
)(MaterialOneOfRenderer);
ConnectedMaterialOneOfRenderer.displayName = 'MaterialOneOfRenderer';
export const materialOneOfControlTester: RankedTester = rankWith(3, isOneOfControl);
export default ConnectedMaterialOneOfRenderer;

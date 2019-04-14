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
import React from 'react';

import {
  ControlProps,
  createDefaultValue,
  isOneOfControl,
  JsonFormsState,
  JsonSchema,
  mapDispatchToControlProps,
  mapStateToControlProps,
  OwnPropsOfControl,
  RankedTester,
  rankWith,
  StatePropsOfControl
} from '@jsonforms/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Hidden,
  Tab,
  Tabs
} from '@material-ui/core';
import { connect } from 'react-redux';
import { ResolvedJsonForms } from '@jsonforms/react';
import { createCombinatorRenderInfos, resolveSubSchemas } from './combinators';
import CombinatorProperties from './CombinatorProperties';
import { Ajv, ErrorObject } from 'ajv';

interface MaterialOneOfState {
  open: boolean;
  proceed: boolean;
  selectedOneOf: number;
  newOneOfIndex?: any;
}

interface OneOfProps {
  rootSchema: JsonSchema;
  ajv: Ajv;
}

class MaterialOneOfRenderer extends React.Component<ControlProps & OneOfProps, MaterialOneOfState> {

  state: MaterialOneOfState = {
    open: false,
    proceed: false,
    selectedOneOf: 0,
    newOneOfIndex: 0
  };
  constructor(props: ControlProps&OneOfProps) {
    super(props);
    const {schema, rootSchema, ajv, data} = this.props;
    const _schema = resolveSubSchemas(schema, rootSchema, 'oneOf');
    const structuralKeywords = ['required', 'additionalProperties', 'type'];
    const dataIsValid = (errors: ErrorObject[]): boolean => {
      return !errors || errors.length === 0 || !errors.find(e => structuralKeywords.indexOf(e.keyword) !== -1);
    };
    for (let i = 0; i < _schema.oneOf.length; i++) {
      const valFn = ajv.compile(_schema.oneOf[i]);
      valFn(data);
      if ( dataIsValid(valFn.errors)) {
        this.state.selectedOneOf = i;
        break;
      }
    }
  }
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
      createDefaultValue(schema.oneOf[this.state.newOneOfIndex])
    );
    this.setState({
      open: false,
      proceed: true,
      selectedOneOf: this.state.newOneOfIndex
    });
  };

  handleTabChange = (_event: any, newOneOfIndex: number) => {
    this.setState({
      open: true,
      newOneOfIndex
    });
  };

  render() {

    const oneOf = 'oneOf';
    const { schema, path, rootSchema, id, visible } = this.props;
    const _schema = resolveSubSchemas(schema, rootSchema, oneOf);
    const oneOfRenderInfos = createCombinatorRenderInfos((_schema as JsonSchema).oneOf, rootSchema, oneOf);

    return (
      <Hidden xsUp={!visible}>
        <CombinatorProperties
          schema={_schema}
          combinatorKeyword={'oneOf'}
          path={path}
        />
        <Tabs value={this.state.selectedOneOf} onChange={this.handleTabChange}>
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
            <Button onClick={this.confirm} color='primary' autoFocus id={`oneOf-${id}-confirm-yes`}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Hidden>
    );

  }
}

const mapMyStateToControlProps = (state: JsonFormsState, ownProps: OwnPropsOfControl): StatePropsOfControl&OneOfProps => {
  const props = mapStateToControlProps(state, ownProps);
  return {...props, ajv: state.jsonforms.core.ajv};
};

const ConnectedMaterialOneOfRenderer = connect(
  mapMyStateToControlProps,
  mapDispatchToControlProps
)(MaterialOneOfRenderer);
ConnectedMaterialOneOfRenderer.displayName = 'MaterialOneOfRenderer';
export const materialOneOfControlTester: RankedTester = rankWith(3, isOneOfControl);
export default ConnectedMaterialOneOfRenderer;

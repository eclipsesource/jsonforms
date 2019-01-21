import * as React from 'react';

import {
  Categorization,
  Category,
  ControlElement,
  ControlProps,
  createCleanLabel,
  createDefaultValue,
  generateDefaultUISchema,
  isOneOfControl,
  JsonSchema,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  toDataPath,
  UISchemaElement,
} from '@jsonforms/core';
import MaterialCategorizationLayout from '../layouts/MaterialCategorizationLayout';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { connect } from 'react-redux';

const createControls =
    (oneOf: JsonSchema[], schema: JsonSchema, scope: string): UISchemaElement => {
        const categorization: Categorization = {
            label: scope,
            type: 'Categorization',
            elements: []
        };
        return oneOf.map((subSchema, index) => {
                let label = toDataPath(scope);
                if (subSchema.type === 'object') {
                    label = createCleanLabel(Object.keys(subSchema.properties)[0]) + '...';
                }
                return {
                    uischema: generateDefaultUISchema(
                        subSchema,
                        'VerticalLayout',
                        `${scope}/oneOf/${index}`,
                        schema
                    ),
                    label
                };
            }
        ).reduce(
            (layout, element) => {
                const category: Category = {
                    type: 'Category',
                    label: element.label,
                    elements: [element.uischema]
                };
                return {
                    ...layout,
                    elements: (layout as Categorization).elements.slice().concat([category])
                };
            },
            categorization
        );
    };

interface MaterialOneOfState {
    open: boolean;
    proceed: boolean;
    selected: number;
    newSelection?: any;
}

class MaterialOneOfRenderer extends React.Component<ControlProps, MaterialOneOfState> {

    state: MaterialOneOfState = {
        open: false,
        proceed: false,
        selected: 0,
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    cancel = () => {
        this.setState({
            open: false,
            proceed: false,
        });
    };

    confirm = () => {
        // TODO: use setState based on function
        const control = this.props.uischema as ControlElement;
        this.props.handleChange(
            toDataPath(control.scope),
            createDefaultValue(this.props.scopedSchema.oneOf[this.state.selected])
        );
        this.setState({
            open: false,
            proceed: true,
            selected: this.state.newSelection
        });
    };

    render() {

        const {
            schema,
            uischema,
            scopedSchema,
            path,
        } = this.props;

        const elements = createControls(
            (scopedSchema as JsonSchema).oneOf,
            schema,
            (uischema as ControlElement).scope
        );

        return (
            <React.Fragment>
                <MaterialCategorizationLayout
                    ownState={false}
                    onChange={(newSelection: any) => {
                        if (newSelection !== this.state.selected) {
                            this.setState({
                                proceed: false,
                                open: true,
                                newSelection,
                            });
                        }
                    }}
                    selected={this.state.selected}
                    schema={schema}
                    uischema={elements}
                    path={path}
                />
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
export const materialOneOfControlTester: RankedTester = rankWith(2, isOneOfControl);
export default ConnectedMaterialOneOfRenderer;

// tslint:disable:jsx-no-multiline-js
// tslint:disable:max-line-length
import has from 'lodash/has';
import get from 'lodash/get';
import React from 'react';
import {
    Actions,
    ControlState,
    findUISchema,
    getData,
    JsonFormsState,
    JsonSchema,
    OwnPropsOfControl,
    Paths,
    Resolve,
    Runtime, StatePropsOfControl,
    UISchemaElement,
} from '@jsonforms/core';
import { Control, ResolvedJsonForms } from '@jsonforms/react';
/* tslint:disable:next-line */
const HTML5Backend = require('react-dnd-html5-backend');
const { DragDropContext } = require('react-dnd');
import { connect } from 'react-redux';
import { compose } from 'recompose';
import ObjectListItem from './ObjectListItem';
import { ExpandRootArray } from './ExpandRootArray';
import AddItemDialog from './AddItemDialog';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import { InstanceLabelProvider, SchemaLabelProvider } from '../helpers/LabelProvider';
import { AnyAction, Dispatch } from 'redux';

export interface MasterProps {
    schema: JsonSchema;
    path: string;
    rootData: any;
    selection: any;
    // TODO: unify types
    handlers: {
        onAdd: any;
        onRemove?: any;
        onSelect: any;
        resetSelection: any;
    };
    uischema: UISchemaElement;
    filterPredicate: any;
    labelProviders: {
        forSchema: SchemaLabelProvider;
        forData: InstanceLabelProvider;
    };
    imageProvider: any;
}

const Master = (
    {
        schema,
        path,
        selection,
        handlers,
        uischema,
        rootData,
        filterPredicate,
        labelProviders,
        imageProvider
    }: MasterProps) => {
    if (schema.items !== undefined) {
        return (
            <ul>
                <ExpandRootArray
                    rootData={rootData}
                    schema={schema.items}
                    path={path}
                    selection={selection}
                    handlers={handlers}
                    filterPredicate={filterPredicate}
                    labelProvider={labelProviders.forData}
                    imageProvider={imageProvider}
                />
            </ul>
        );
    }

    return (
        <ul>
            <ObjectListItem
                path={path}
                schema={schema}
                uischema={uischema}
                selection={selection}
                handlers={handlers}
                isRoot={true}
                filterPredicate={filterPredicate}
                labelProvider={labelProviders.forData}
                imageProvider={imageProvider}
            />
        </ul>
    );
};

const isNotTuple = (schema: JsonSchema) => !Array.isArray(schema.items);

const styles: StyleRulesCallback<'treeMasterDetailContent' |
    'treeMasterDetail' |
    'treeMasterDetailMaster' |
    'treeMasterDetailDetail'> = () => ({
    treeMasterDetailContent: {
      paddingTop: '1em',
      paddingBottom: '1em'
    },
    // tslint:disable-next-line: object-literal-key-quotes
    treeMasterDetail: {
        display: 'flex',
        flexDirection: 'column',
        // tslint:disable-next-line:object-literal-key-quotes
        '& $treeMasterDetailContent': {
            display: 'flex',
            flexDirection: 'row'
        }
    },
    // tslint:disable-next-line: object-literal-key-quotes
    treeMasterDetailMaster: {
        flex: 1,
        padding: '0.5em',
        height: 'auto',
        borderRight: '0.2em solid lightgrey',
        borderWidth: 'thin',
        // tslint:disable-next-line:object-literal-key-quotes
        '& ul': {
            listStyleType: 'none',
            margin: 0,
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            // tslint:disable-next-line:object-literal-key-quotes
            '&:after': {
                content: '""',
                position: 'absolute',
                left: '0.2em',
                height: '0.6em',
                bottom: '0'
            }, // tslint:disable-next-line:object-literal-key-quotes
            '&:last-child::after': {
                display: 'none'
            }
        }
    },
    // tslint:disable-next-line: object-literal-key-quotes
    treeMasterDetailDetail: {
        flex: 3,
        padding: '0.5em',
        paddingLeft: '1em',
      // tslint:disable-next-line:object-literal-key-quotes
        '&:first-child': {
            marginRight: '0.25em'
        }
    }
});

export interface TreeWithDetailState extends ControlState {
    selected: {
        schema: JsonSchema,
        data: any,
        path: string
    };
    dialog: {
        open: boolean,
        schema: JsonSchema,
        path: string
    };
}

export interface StatePropsOfTreeWithDetail extends StatePropsOfControl {
    classes?: any;
    rootData: any;
    resolvedRootData: any;
    filterPredicate: any;
    labelProviders: {
        forSchema: SchemaLabelProvider;
        forData: InstanceLabelProvider;
    };
    imageProvider: any;
}

export interface DispatchPropsOfTreeWithDetail {
    addToRoot: any;
}

export interface TreeWithDetailProps
    extends StatePropsOfTreeWithDetail, DispatchPropsOfTreeWithDetail {

}

export class TreeWithDetailRenderer extends Control
    <TreeWithDetailProps &
        WithStyles<'treeMasterDetailContent' |
            'treeMasterDetail'|
            'treeMasterDetailMaster' |
            'treeMasterDetailDetail'>,
        TreeWithDetailState> {

    componentWillMount() {
        const { uischema, resolvedRootData, scopedSchema } = this.props;
        const controlElement = uischema;
        this.setState({
            dialog: {
                open: false,
                schema: undefined,
                path: undefined
            }
        });

        const path = Paths.fromScopable(controlElement);
        if (Array.isArray(resolvedRootData)) {
            this.setState({
                selected: {
                    schema: scopedSchema.items as JsonSchema,
                    data: resolvedRootData[0],
                    path: Paths.compose(path, '0')
                }
            });
        } else {
            this.setState({
                selected: {
                    schema: scopedSchema,
                    data: resolvedRootData,
                    path: path
                }
            });
        }
    }

    setSelection = (schema: JsonSchema, data: any, path: string) => () => {
        this.setState({
            selected: {
                schema,
                data,
                path
            }
        });
    };

    openDialog = (schema: JsonSchema, path: string) => () => {
        this.setState({
            dialog: {
                open: true,
                schema,
                path
            }
        });
    };

    closeDialog = () => {
        this.setState({
            dialog: {
                open: false,
                schema: undefined,
                path: undefined
            }
        });
    };

    render() {
        const {
            uischema,
            schema,
            scopedSchema,
            visible,
            path,
            resolvedRootData,
            rootData,
            addToRoot,
            filterPredicate,
            labelProviders,
            imageProvider,
            classes
        } = this.props;
        const controlElement = uischema;
        const dialogProps = {
            open: this.state.dialog.open
        };

        let resetSelection;
        if (scopedSchema.items !== undefined) {
            resetSelection = this.setSelection(scopedSchema.items as JsonSchema, resolvedRootData[0], Paths.compose(path, '0'));
        } else {
            resetSelection = this.setSelection(scopedSchema, resolvedRootData, path);
        }
        const handlers = {
            onSelect: this.setSelection,
            onAdd: this.openDialog,
            resetSelection: resetSelection
        };

        const detailUiSchema = this.props.findUISchema(this.state.selected.schema, undefined, path);

        return (
            <div hidden={!visible} className={classes.treeMasterDetail}>
                <div>
                    <label>
                        {typeof controlElement.label === 'string' ? controlElement.label : ''}
                    </label>
                    {
                        Array.isArray(resolvedRootData) &&
                        <button onClick={addToRoot(schema, path)}>
                            Add to root
                        </button>
                    }
                </div>
                <div className={classes.treeMasterDetailContent}>
                    <div className={classes.treeMasterDetailMaster}>
                        <Master
                            uischema={uischema}
                            schema={scopedSchema}
                            path={path}
                            handlers={handlers}
                            selection={this.state.selected.data}
                            rootData={rootData}
                            filterPredicate={filterPredicate}
                            labelProviders={labelProviders}
                            imageProvider={imageProvider}
                        />
                    </div>
                    <div className={classes.treeMasterDetailDetail}>
                        {
                            this.state.selected ?
                                <ResolvedJsonForms
                                    schema={this.state.selected.schema}
                                    path={this.state.selected.path}
                                    uischema={detailUiSchema}
                                /> : 'Select an item'
                        }
                    </div>
                </div>
                <div>
                    {
                        this.state.dialog.open &&
                        <AddItemDialog
                            path={this.state.dialog.path}
                            schema={this.state.dialog.schema}
                            closeDialog={this.closeDialog}
                            dialogProps={dialogProps}
                            setSelection={this.setSelection}
                            labelProvider={labelProviders.forSchema}
                            imageProvider={imageProvider}
                        />
                    }
                </div>
            </div>
        );
    }
}

export interface WithLabelProviders {
    // TODO typings
    labelProviders: {
        forSchema: SchemaLabelProvider;
        forData: InstanceLabelProvider;
    };
}

export interface WithLabelProvider {
    labelProvider: any;
}

export interface WithImageProvider {
    imageProvider: any;
}

export interface OwnPropsOfTreeControl extends OwnPropsOfControl {
    filterPredicate: any;
}

const mapStateToProps = (state: JsonFormsState, ownProps: OwnPropsOfTreeControl & WithImageProvider & WithLabelProviders): StatePropsOfTreeWithDetail => {
    const path = Paths.compose(ownProps.path, Paths.fromScopable(ownProps.uischema));
    const visible = has(ownProps, 'visible') ? ownProps.visible :  Runtime.isVisible(ownProps, state);
    const enabled = has(ownProps, 'enabled') ? ownProps.enabled :  Runtime.isEnabled(ownProps, state);
    const rootData = getData(state);

    return {
        rootData: getData(state),
        label: get(ownProps.uischema, 'label') as string,
        resolvedRootData: Resolve.data(rootData, path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        scopedSchema: Resolve.schema(ownProps.schema, ownProps.uischema.scope),
        findUISchema: findUISchema(state),
        path,
        visible,
        enabled,
        filterPredicate: ownProps.filterPredicate,
        imageProvider: ownProps.imageProvider,
        labelProviders: ownProps.labelProviders
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchPropsOfTreeWithDetail => ({
    addToRoot(schema: JsonSchema, path: string) {
        return () => {
            if (isNotTuple(schema)) {
                dispatch(
                    Actions.update(
                        path,
                        data => {
                            const clonedData = data.slice();
                            clonedData.push({});

                            return clonedData;
                        }
                    )
                );
            }
        };
    }
});

const DnDTreeMasterDetail = compose<TreeWithDetailProps, TreeWithDetailProps>(
    withStyles(styles, { name: 'TreeMasterDetail' }),
    DragDropContext(HTML5Backend)
)(TreeWithDetailRenderer);

const ConnectedTreeWithDetailRenderer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DnDTreeMasterDetail);
export default ConnectedTreeWithDetailRenderer;

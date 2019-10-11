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
// tslint:disable:jsx-no-multiline-js
// tslint:disable:max-line-length
import get from 'lodash/get';
import React from 'react';
import {
  Actions,
  ControlState,
  createId,
  findUISchema,
  formatErrorMessage,
  getData,
  getErrorAt,
  getSchema,
  JsonFormsState,
  JsonSchema,
  OwnPropsOfControl,
  Paths,
  Resolve,
  Runtime,
  StatePropsOfControl,
  UISchemaElement,
  UISchemaTester
} from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';
/* tslint:disable:next-line */
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import ObjectListItem from './ObjectListItem';
import { ExpandRootArray } from './ExpandRootArray';
import AddItemDialog from './AddItemDialog';
import {
  createStyles,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import {
  InstanceLabelProvider,
  SchemaLabelProvider
} from '../helpers/LabelProvider';
import { AnyAction, Dispatch } from 'redux';
import { union } from 'lodash';

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

const Master = ({
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

const styles = createStyles({
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
    schema: JsonSchema;
    data: any;
    path: string;
  };
  dialog: {
    open: boolean;
    schema: JsonSchema;
    path: string;
  };
}

export interface StatePropsOfTreeWithDetail extends StatePropsOfControl {
  classes?: any;
  rootData: any;
  filterPredicate: any;
  labelProviders: {
    forSchema: SchemaLabelProvider;
    forData: InstanceLabelProvider;
  };
  imageProvider: any;
  uischemas?: { tester: UISchemaTester; uischema: UISchemaElement }[];
}

export interface DispatchPropsOfTreeWithDetail {
  addToRoot: any;
}

export interface TreeWithDetailProps
  extends StatePropsOfTreeWithDetail,
  DispatchPropsOfTreeWithDetail { }

export class TreeWithDetailRenderer extends React.Component<
  TreeWithDetailProps &
  WithStyles<
    | 'treeMasterDetailContent'
    | 'treeMasterDetail'
    | 'treeMasterDetailMaster'
    | 'treeMasterDetailDetail'
  >,
  TreeWithDetailState
  > {
  componentWillMount() {
    const { uischema, data, schema } = this.props;
    const controlElement = uischema;
    this.setState({
      dialog: {
        open: false,
        schema: undefined,
        path: undefined
      }
    });

    const path = Paths.fromScopable(controlElement);
    if (Array.isArray(data)) {
      this.setState({
        selected: {
          schema: schema.items as JsonSchema,
          data: data[0],
          path: Paths.compose(
            path,
            '0'
          )
        }
      });
    } else {
      this.setState({
        selected: {
          schema: schema,
          data: data,
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
      visible,
      path,
      data,
      rootData,
      addToRoot,
      filterPredicate,
      labelProviders,
      imageProvider,
      classes,
      uischemas
    } = this.props;
    const controlElement = uischema;
    const dialogProps = {
      open: this.state.dialog.open
    };

    let resetSelection;
    if (schema.items !== undefined) {
      resetSelection = this.setSelection(
        schema.items as JsonSchema,
        data[0],
        Paths.compose(
          path,
          '0'
        )
      );
    } else {
      resetSelection = this.setSelection(schema, data, path);
    }
    const handlers = {
      onSelect: this.setSelection,
      onAdd: this.openDialog,
      resetSelection: resetSelection
    };

    const detailUiSchema = findUISchema(
      uischemas,
      this.state.selected.schema,
      undefined,
      path
    );

    return (
      <div hidden={!visible} className={classes.treeMasterDetail}>
        <div>
          <label>
            {typeof controlElement.label === 'string'
              ? controlElement.label
              : ''}
          </label>
          {Array.isArray(data) && (
            <button onClick={addToRoot(schema, path)}>Add to root</button>
          )}
        </div>
        <div className={classes.treeMasterDetailContent}>
          <div className={classes.treeMasterDetailMaster}>
            <Master
              uischema={uischema}
              schema={schema}
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
            {this.state.selected ? (
              <JsonFormsDispatch
                schema={this.state.selected.schema}
                path={this.state.selected.path}
                uischema={detailUiSchema}
              />
            ) : (
                'Select an item'
              )}
          </div>
        </div>
        <div>
          {this.state.dialog.open && (
            <AddItemDialog
              path={this.state.dialog.path}
              schema={this.state.dialog.schema}
              closeDialog={this.closeDialog}
              dialogProps={dialogProps}
              setSelection={this.setSelection}
              labelProvider={labelProviders.forSchema}
              imageProvider={imageProvider}
            />
          )}
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

const mapStateToProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfTreeControl & WithImageProvider & WithLabelProviders
): StatePropsOfTreeWithDetail => {
  const rootData = getData(state);
  const path = Paths.compose(
    ownProps.path,
    Paths.fromScopable(ownProps.uischema)
  );
  const visible = ownProps.visible !== undefined
    ? ownProps.visible
    : Runtime.isVisible(ownProps.uischema, rootData);
  const enabled = ownProps.enabled !== undefined
    ? ownProps.enabled
    : Runtime.isEnabled(ownProps.uischema, rootData);
  const rootSchema = getSchema(state);
  const resolvedSchema = Resolve.schema(
    ownProps.schema,
    ownProps.uischema.scope,
    rootSchema
  );

  return {
    rootData: getData(state),
    label: get(ownProps.uischema, 'label') as string,
    data: Resolve.data(rootData, path),
    uischema: ownProps.uischema,
    schema: resolvedSchema || rootSchema,
    uischemas: state.jsonforms.uischemas,
    path,
    visible,
    enabled,
    filterPredicate: ownProps.filterPredicate,
    imageProvider: ownProps.imageProvider,
    labelProviders: ownProps.labelProviders,
    rootSchema: getSchema(state),
    id: createId('tree'),
    errors: formatErrorMessage(
      union(
        getErrorAt(path, resolvedSchema || rootSchema)(state).map(
          error => error.message
        )
      )
    )
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<AnyAction>
): DispatchPropsOfTreeWithDetail => ({
  addToRoot(schema: JsonSchema, path: string) {
    return () => {
      if (isNotTuple(schema)) {
        dispatch(
          Actions.update(path, data => {
            const clonedData = data.slice();
            clonedData.push({});

            return clonedData;
          })
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

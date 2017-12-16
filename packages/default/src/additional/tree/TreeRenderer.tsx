import * as _ from 'lodash';
import * as React from 'react';
import {
  // ContainmentProperty,
  Control,
  ControlProps,
  ControlState,
  DispatchRenderer,
  generateDefaultUISchema,
  getData,
  isEnabled,
  isVisible,
  JsonForms,
  JsonSchema,
  MasterDetailLayout,
  Paths,
  resolveData,
  resolveSchema,
  UISchemaElement,
  update
} from 'jsonforms-core';
import { connect } from 'react-redux';
import ObjectListItem from './ObjectListItem';
import { ExpandArray } from './ExpandArray';

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
  };
  uischema: UISchemaElement;
}

const Master = (
  {
    schema,
    path,
    selection,
    handlers,
    uischema,
    rootData
  }: MasterProps) => {
  // TODO: so far no drag and drop support
  if (schema.items !== undefined) {
    return (
      <ul>
        <ExpandArray
          rootData={rootData}
          schema={schema.items as JsonSchema}
          path={path}
          selection={selection}
          handlers={handlers}
          uischema={uischema}
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
      />
    </ul>
  );
};

const isNotTuple = (schema: JsonSchema) => !Array.isArray(schema.items);

export interface TreeMasterDetailState extends ControlState {
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

export interface TreeProps extends ControlProps {
  resolvedSchema: any;
  rootData: any;
  resolvedRootData: any;
}

export class TreeMasterDetail extends Control<TreeProps, TreeMasterDetailState> {

  componentWillMount() {
    const { uischema, resolvedRootData, resolvedSchema } = this.props;
    const controlElement = uischema as MasterDetailLayout;
    this.setState({
      dialog: {
        open: false,
        schema: undefined,
        path: undefined
      }
    });

    if (_.isArray(resolvedRootData)) {
      const path = Paths.fromScopable(controlElement);
      this.setState({
        selected: {
          schema: resolvedSchema.items,
          data: resolvedRootData[0],
          path: Paths.compose(path, '0')
        }
      });
    } else {
      this.setState({
        selected: {
          schema: resolvedSchema,
          data: resolvedRootData,
          path: ''
        }
      });
    }
  }

  setSelection = (schema, data, path) => () => {
    return () => this.setState({
      selected: {
        schema,
        data,
        path
      }
    });
  }

  openDialog = (schema, path) => () => {
    this.setState({
      dialog: {
        open: true,
        schema,
        path
      }
    });
  }

  closeDialog = () => {
    this.setState({
      dialog: {
        open: false,
        schema: undefined,
        path: undefined
      }
    });
  }

  render() {
    const { uischema, resolvedSchema, visible, dispatch, path, rootData } = this.props;
    const controlElement = uischema as MasterDetailLayout;
    const dialogProps = {
      open: this.state.dialog.open
    };
    const resolvedRootData = resolveData(rootData, path);
    const handlers = {
      onSelect: this.setSelection,
      onAdd: this.openDialog,
    };

    return (
      <div hidden={!visible} className={'jsf-treeMasterDetail'}>
        <div className={'jsf-treeMasterDetail-header'}>
          <label>
            {typeof controlElement.label === 'string' ? controlElement.label : ''}
          </label>
          {
            Array.isArray(resolvedRootData) &&
            <button
              className='jsf-treeMasterDetail-add'
              onClick={() => this.addToRoot()}
            >
              Add to root
            </button>
          }
        </div>
        <div className='jsf-treeMasterDetail-content'>
          <div className='jsf-treeMasterDetail-master'>
            <Master
              uischema={uischema}
              schema={resolvedSchema}
              path={path}
              handlers={handlers}
              selection={this.state.selected.data}
              rootData={rootData}
            />
          </div>
          <div className='jsf-treeMasterDetail-detail'>
            {
              this.state.selected ?
                <DispatchRenderer
                  schema={this.state.selected.schema}
                  path={this.state.selected.path}
                  uischema={generateDefaultUISchema(this.state.selected.schema)}
                /> : 'Select an item'
            }
          </div>
        </div>
        <div>
          {
            this.state.dialog.open &&
            <dialog id='dialog' {...dialogProps}>
              <label>
                Select item to create
              </label>
              <div className='dialog-content content'>
                {
                  JsonForms.schemaService.getContainmentProperties(this.state.dialog.schema)
                    .map(prop =>
                      <button
                        className={JsonForms.stylingRegistry.getAsClassName('button')}
                        key={`${prop.label}-button`}
                        onClick={() => {
                          const newData = _.keys(prop.schema.properties).reduce(
                            (d, key) => {
                              if (prop.schema.properties[key].default) {
                                d[key] = prop.schema.properties[key].default;
                              }

                              return d;
                            },
                            {}
                          );
                          dispatch(
                            update(
                              Paths.compose(this.state.dialog.path, prop.property),
                              array => {
                                if (_.isEmpty(array)) {
                                  return [newData];
                                }
                                array.push(newData);

                                return array;
                              }
                            )
                          );
                          this.closeDialog();
                        }}
                      >
                        {prop.label}
                      </button>
                    )
                }
              </div>
              <button
                className='jsf-treeMasterDetail-dialog-close'
                onClick={this.closeDialog}>
                Close
              </button>
            </dialog>
          }
        </div>
      </div>
    );
  }

  private addToRoot() {
    const { schema, dispatch, path } = this.props;

    if (isNotTuple(schema)) {
      dispatch(
        update(
          path,
          data => {
            const clone = data.slice();
            clone.push({});

            return clone;
          }
        )
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const path = Paths.compose(ownProps.path, Paths.fromScopable(ownProps.uischema));
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const rootData = getData(state);

  return {
    rootData: getData(state),
    resolvedRootData: resolveData(rootData, path),
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    resolvedSchema: resolveSchema(ownProps.schema, ownProps.uischema.scope.$ref),
    path,
    visible,
    enabled
  };
};

export default connect(mapStateToProps)(TreeMasterDetail);

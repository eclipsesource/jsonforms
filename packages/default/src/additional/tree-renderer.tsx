import * as _ from 'lodash';
import * as React from 'react';
import {
  and,
  compose,
  ContainmentProperty,
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
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveData,
  resolveSchema,
  toDataPathSegments,
  uiTypeIs,
  update
} from 'jsonforms-core';
import {connect} from 'react-redux';
import {SyntheticEvent} from "react";

/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
export const treeMasterDetailTester: RankedTester =
  rankWith(
    2,
    and(
      uiTypeIs('MasterDetailLayout'),
      uischema => {
        const control = uischema as MasterDetailLayout;
        if (control.scope === undefined || control.scope === null) {
          return false;
        }

        return !(control.scope.$ref === undefined || control.scope.$ref === null);
      }
    ));

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
}

export class TreeMasterDetail extends Control<TreeProps, TreeMasterDetailState> {

  componentWillMount() {
    const { uischema, data, resolvedSchema } = this.props;
    const controlElement = uischema as MasterDetailLayout;

    this.setState({
      dialog: {
        open: false,
        schema: undefined,
        path: undefined
      }
    });

    if (_.isArray(data)) {
      const dataPathSegments = toDataPathSegments(controlElement.scope.$ref);
      const path = _.isEmpty(dataPathSegments) ? '' : dataPathSegments.join('.');
      this.setState({
        selected: {
          schema: resolvedSchema.items,
          data: data[0],
          path: compose(path, '0')
        }
      });
    } else {
      this.setState({
        selected: {
          schema: resolvedSchema,
          data,
          path: ''
        }
      });
    }
  }

  render() {
    const { uischema, resolvedSchema, visible, dispatch } = this.props;
    const controlElement = uischema as MasterDetailLayout;
    const rootData = this.props.data;

    const dialogProps = {
      open: this.state.dialog.open
    };

    return (
      <div hidden={!visible} className={'jsf-treeMasterDetail'}>
        <div className={'jsf-treeMasterDetail-header'}>
          <label>
            {  typeof controlElement.label === 'string' ? controlElement.label : '' }
          </label>
          {
            Array.isArray(rootData) &&
            <button className='jsf-treeMasterDetail-add'
                    onClick={() => this.addToRoot() }
            >
              Add to root
            </button>
          }
        </div>
        <div className='jsf-treeMasterDetail-content'>
          <div className='jsf-treeMasterDetail-master'>
            {this.renderMaster(resolvedSchema)}
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
                              compose(this.state.dialog.path, prop.property),
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
                onClick={() => this.closeDialog()}>
                Close
              </button>
            </dialog>
          }
        </div>
      </div>
    );
  }

  private closeDialog() {
    this.setState({
      dialog: {
        open: false,
        schema: undefined,
        path: undefined
      }
    });
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

  private renderMaster(schema: JsonSchema) {
    // TODO: so far no drag and drop support
    if (schema.items !== undefined) {
      return (
        <ul>{ this.expandRootArray(schema.items as JsonSchema) }</ul>
      );
    }

    return (<ul>{ this.expandObject(this.props.path, schema, null) }</ul>);
  }

  /**
   * Expands the given array of root elements by expanding every element.
   * It is assumed that the roor elements do not support drag and drop.
   * Based on this, a delete function is created for every element.
   *
   * @param schema the {@link JsonSchema} defining the elements' type
   */
  private expandRootArray(schema: JsonSchema) {
    const { path } = this.props;
    const data = this.props.data;
    if (data === undefined || data === null) {
      return;
    }

    return data.map((element, index) => {
      const composedPath = compose(path, index + '');

      return this.expandObject(
        composedPath,
        schema,
        path
      );
    });
  }

  /**
   * Expands the given data array by expanding every element.
   * If the parent data containing the array is provided,
   * a suitable delete function for the expanded elements is created.
   *
   * @param data the array to expand
   * @param property the {@link ContainmentProperty} defining the property that the array belongs to
   * @param path the instance path where data can be obtained from
   */
  private expandArray(data: Object[],
                      property: ContainmentProperty,
                      path: string) {

    if (data === undefined || data === null) {
      return;
    }

    return data.map((element, index) => {
      const composedPath = compose(path, index.toString());
      return this.expandObject(composedPath, property.schema, path);
    });
  }

  private getNamingFunction(schema: JsonSchema): (element: Object) => string {

    const { uischema } = this.props;
    if (uischema.options !== undefined) {
      const labelProvider = uischema.options.labelProvider;
      if (labelProvider !== undefined && labelProvider[schema.id] !== undefined) {
        return element => {
          return element[labelProvider[schema.id]];
        };
      }
    }

    const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element => element[namingKeys[0]];
    }

    return obj => JSON.stringify(obj);
  }

  /**
   * Renders a data object as a <li> child element of the given <ul> list.
   *
   * @param path the instance path of the object to be expanded
   * @param schema The schema describing the rendered data's type
   * @param parentPath the instance parent path holding the object to be expanded
   */
  // TODO: Extract to component
  private expandObject(
    path: string,
    schema: JsonSchema,
    parentPath?: string
  ) {

    const { uischema, rootData, dispatch } = this.props;
    const data = resolveData(rootData, path);
    const liClasses = this.state.selected === data ? 'selected' : '';

    // TODO: key should be set in caller
    const vnode = (
      <li className={liClasses} key={path}>
        <div>
          {
            _.has(uischema.options, 'imageProvider') ?
              <span className={`icon ${uischema.options.imageProvider[schema.id]}`} /> : ''
          }

          <span
            className='label'
            onClick={ev =>
              this.setState({
                selected: {
                  schema,
                  data,
                  path: path
                }
              })
            }
          >
          <span>
            {this.getNamingFunction(schema)(data)}
          </span>
            {
              JsonForms.schemaService.hasContainmentProperties(schema) ?
                (<span
                  className='add'
                  onClick={(ev: SyntheticEvent<HTMLSpanElement>) =>
                    this.setState({
                      dialog: {
                        open: true,
                        schema,
                        path: path
                      }
                    })
                  }
                >
                {'\u2795'}
              </span>) : ''
            }
            {
              parentPath !== null &&
              <span className='remove' onClick ={() => {
                dispatch(
                  update(
                    parentPath,
                    array => {
                      const copy = array.slice();
                      return _.filter(copy, el => !_.isEqual(el, data))
                    }
                  )
                )
              }}>
                {'\u274C'}
              </span>
            }
        </span>
        </div>
        {
          // render contained children of this element
          JsonForms.schemaService.getContainmentProperties(schema)
            .filter(prop => this.propHasData(prop, data))
            .map(prop => <ul key={prop.label}>{ this.renderChildren(prop, path, schema) }</ul>)
        }
      </li>
    );

    // add a separate list for each containment property
    JsonForms.schemaService.getContainmentProperties(schema).forEach(p => {
      const id = p.schema.id;
      if (id === undefined || id === null) {
        // TODO proper logging
        console.warn(`The property's schema with label '${p.label}' has no id. DnD not possible.`);

        return;
      }
      // FIXME: DND support
      // FIXME: create child list and activate drag and drop
      // registerDnDWithGroupId(this.treeNodeMapping, ul, id);
    });

    return vnode;
  }

  private propHasData(prop: ContainmentProperty, data: any) {

    const { uischema } = this.props;
    const sid = prop.schema.id;

    if (sid === undefined || sid === null) {
      // TODO proper logging
      console.warn(`The property's schema with label '${prop.label}' has no id. DnD not possible.`);
    }

    let propertyData = prop.getData(data) as Object[];
    /*tslint:disable:no-string-literal */
    if (uischema.options !== undefined &&
      uischema.options['modelMapping'] !== undefined
      && !_.isEmpty(propertyData)) {

      propertyData = propertyData.filter(value => {
        // only use filter criterion if the checked value has the mapped attribute
        if (value[uischema.options['modelMapping'].attribute]) {
          return prop.schema.id === uischema.options['modelMapping']
            .mapping[value[uischema.options['modelMapping'].attribute]];
        }

        return true;
      });
    }

    // TODO: remove check OR add id to test data (?)
    return !_.isEmpty(propertyData);
  }

  // TODO: update selected element once selection has been changed
  private renderChildren(prop: ContainmentProperty,
                         parentPath: string,
                         parentSchema: JsonSchema) {

    const composedPath = compose(parentPath, prop.property);
    const data = resolveData(this.props.data, composedPath);
    const schema = prop.schema;
    const array = data;
    const key = prop.property;
    const parentProperties = JsonForms.schemaService.getContainmentProperties(parentSchema);

    for (const property of parentProperties) {
      // If available, additionally use schema id to identify the correct property
      if (!_.isEmpty(schema.id) && schema.id !== property.schema.id) {
        continue;
      }
      if (key === property.property) {
        return this.expandArray(array, property, composedPath);
      }
    }
    // TODO proper logging
    console.warn('Could not render children because no fitting property was found.');

    return undefined;
  }
}

const mapStateToProps = (state, ownProps) => {
  const path = compose(ownProps.path, toDataPathSegments(ownProps.uischema.scope.$ref).join('.'));
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);

  return {
    rootData: getData(state),
    data: resolveData(getData(state), path),
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    resolvedSchema: resolveSchema(ownProps.schema, ownProps.uischema.scope.$ref),
    path,
    visible,
    enabled
  };
};

export default registerStartupRenderer(
  treeMasterDetailTester,
  connect(mapStateToProps)(TreeMasterDetail)
);

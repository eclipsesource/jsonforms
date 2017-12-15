import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  JsonForms,
  JsonSchema,
  Paths,
  resolveData,
  UISchemaElement,
  update
} from '@jsonforms/core';
import { ExpandArray } from './ExpandArray';

const getNamingFunction =
  (schema: JsonSchema, uischema: UISchemaElement) => (element: Object): string => {
    if (uischema.options !== undefined) {
      const labelProvider = uischema.options.labelProvider;
      if (labelProvider !== undefined && labelProvider[schema.id] !== undefined) {
        return element[labelProvider[schema.id]];
      }
    }

    const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element[namingKeys[0]];
    }

    return JSON.stringify(element);
  };

const propHasData = (
  prop,
  data,
  uischema
) => {

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
};

export interface ObjectListItemProps {
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
  resolvedRootData: any;
  data: any;
  remove?: any;
  isSelected: any;
  setSelection: any;
  openDialog: any;
}

const ObjectListItem = ({
                        path,
                        schema,
                        uischema,
                        resolvedRootData,
                        data,
                        remove,
                        isSelected,
                        setSelection,
                        openDialog
                      }: ObjectListItemProps) => {

  const pathSegments = path.split('.');
  const parentPath = _.initial(pathSegments).join('.');
  const liClasses = isSelected ? /*this.state.selected === data ?*/ 'selected' : '';

  const hasParent = !_.isEmpty(parentPath)

  // TODO: key should be set in caller
  return (
    <li className={liClasses} key={path}>
      <div>
        {
          _.has(uischema.options, 'imageProvider') ?
            <span className={`icon ${uischema.options.imageProvider[schema.id]}`} /> : ''
        }

        <span
          className='label'
          onClick={setSelection(schema, data, path)}
        >
          <span>
            {getNamingFunction(schema, uischema)(data)}
          </span>
          {
            JsonForms.schemaService.hasContainmentProperties(schema) ?
              (
                <span
                  className='add'
                  onClick={openDialog(schema, path)}
                >
                  {'\u2795'}
                </span>
              ) : ''
          }
          {
            (hasParent || _.isArray(resolvedRootData)) &&
            <span
              className='remove'
              onClick={remove}
            >
              {'\u274C'}
            </span>
          }
        </span>
      </div>
      {
        // render contained children of this element
        JsonForms.schemaService.getContainmentProperties(schema)
          .filter(prop => propHasData(prop, data, uischema))
          .map(prop =>
            <ul key={prop.label}>
              <RenderChildren
                prop={prop}
                path={path}
                schema={schema}
                resolvedRootData={resolvedRootData}
                isSelected={isSelected}
                uischema={uischema}
                openDialog={openDialog}
                setSelection={setSelection}
              />
            </ul>)
      }
    </li>
  );
};

const mapStateToProps = state => {
  return {
    rootData: getData(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

  const parentPath = _.initial(ownProps.path.split('.')).join('.');

  return {
    remove(data) {
      dispatch(
        update(
          parentPath,
          array => _.filter(array.slice(), el => !_.isEqual(el, data))
        )
      );
    }
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const data = resolveData(stateProps.rootData, ownProps.path);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    data,
    remove() {
      return dispatchProps.remove(data);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ObjectListItem);

// TODO: update selected element once selection has been changed
const RenderChildren = ({
                          prop,
                          path,
                          schema,
                          resolvedRootData,
                          isSelected,
                          uischema,
                          openDialog,
                          setSelection
                        }) => {

  const composedPath = Paths.compose(path, prop.property);
  const array = resolveData(resolvedRootData, composedPath);
  const propSchema = prop.schema;
  const propKey = prop.property;

  const parentProperties = JsonForms.schemaService.getContainmentProperties(schema);

  for (const property of parentProperties) {
    // If available, additionally use schema id to identify the correct property
    if (!_.isEmpty(propSchema.id) && propSchema.id !== property.schema.id) {
      continue;
    }
    if (propKey === property.property) {
      return (
        <ExpandArray
          data={array}
          property={property}
          path={composedPath}
          resolvedRootData={resolvedRootData}
          isSelected={isSelected}
          openDialog={openDialog}
          setSelection={setSelection}
          uischema={uischema}
        />
      );
    }
  }

  return undefined;
};

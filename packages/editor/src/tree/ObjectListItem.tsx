// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  JsonSchema,
  resolveData,
  UISchemaElement,
  update
} from '@jsonforms/core';
import ExpandArray from './ExpandArray';
import { SchemaService } from '../services/schema.service';

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

export interface ObjectListItemProps {
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
  rootData: any;
  data: any;
  selection: any;
  handlers: {
    onRemove?: any;
    onAdd: any;
    onSelect: any;
  };
  schemaService: SchemaService;
}

const ObjectListItem = (
  {
    path,
    schema,
    uischema,
    rootData,
    data,
    handlers,
    selection,
    schemaService
  }: ObjectListItemProps) => {

  const pathSegments = path.split('.');
  const parentPath = _.initial(pathSegments).join('.');
  const liClasses = selection === data ? 'selected' : '';
  const hasParent = !_.isEmpty(parentPath);
  const scopedData = resolveData(rootData, parentPath);
  const containmentProps = schemaService.getContainmentProperties(schema);
  const groupedProps = _.groupBy(containmentProps, property => property.property);

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
          onClick={handlers.onSelect(schema, data, path)}
        >
          <span>
            {getNamingFunction(schema, uischema)(data)}
          </span>
          {
            schemaService.hasContainmentProperties(schema) ?
              (
                <span
                  className='add'
                  onClick={handlers.onAdd(schema, path)}
                >
                  {'\u2795'}
                </span>
              ) : ''
          }
          {
            (hasParent || _.isArray(scopedData)) &&
            <span
              className='remove'
              onClick={handlers.onRemove}
            >
              {'\u274C'}
            </span>
          }
        </span>
      </div>
      {
      Object.keys(groupedProps).map(groupKey =>
        <ul key={_.head(groupedProps[groupKey]).property}>
          <ExpandArray
                props={groupedProps[groupKey]}
                path={path}
                schema={schema}
                selection={selection}
                uischema={uischema}
                handlers={handlers}
                schemaService={schemaService}
          />
        </ul>
      )
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
    handlers: {
      ...ownProps.handlers,
      onRemove() {
        return dispatchProps.remove(data);
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ObjectListItem);

// tslint:disable:jsx-no-multiline-js
// tslint:disable:jsx-no-lambda
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  Paths,
  Resolve,
  update
} from '@jsonforms/core';
import {
  getContainersProperties
} from '../reducers';

const Dialog = (
  {
    add,
    path,
    schema,
    closeDialog,
    dialogProps,
    schemaService,
    setSelection,
    rootData,
    containersProperties
  }) => {
  let containerProps;
  if (containersProperties !== undefined && containersProperties[schema.id]) {
    containerProps = containersProperties[schema.id];
  } else {
    containerProps = schemaService.getContainerProperties(schema);
  }
  return (
    <dialog id='dialog' {...dialogProps}>
      <label>
        Select item to create
      </label>
      <div className='dialog-content content'>
        {
          containerProps
            .map(prop =>
              <button
                className='btn button waves-effect waves-light jsf-treeMasterDetail-dialog-button'
                key={`${prop.label}-button`}
                onClick={() => {
                  const newData = _.keys(prop.schema.properties).reduce(
                    (d, key) => {
                      if (prop.schema.properties[key].default) {
                        d[key] = prop.schema.properties[key].default;
                      }

                      // FIXME generate id if identifying property is set in editor to allow id refs
                      return d;
                    },
                    {}
                  );

                  const arrayPath = Paths.compose(path, prop.property);
                  const array = Resolve.data(rootData, arrayPath) as any[];
                  const selectionIndex = _.isEmpty(array) ? 0 : array.length;
                  const selectionPath = Paths.compose(arrayPath, selectionIndex.toString());

                  add(path, prop, newData);
                  setSelection(prop.schema, newData, selectionPath)();
                  closeDialog();
                }}
              >
                {prop.label}
              </button>
            )
        }
      </div>
      <button
        className='btn button waves-effect waves-light jsf-treeMasterDetail-dialog-close'
        onClick={closeDialog}
      >
        Close
      </button>
    </dialog>
  );
};

const mapStateToProps = state => {
  return {
    rootData: getData(state),
    containersProperties: getContainersProperties(state)
  };
};

const mapDispatchToProps = dispatch => ({
    add(path, prop, newData) {
      dispatch(
        update(
          Paths.compose(path, prop.property),
          array => {
            if (_.isEmpty(array)) {
              return [newData];
            }
            array.push(newData);

            return array;
          }
        )
      );
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dialog);

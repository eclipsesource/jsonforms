// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  JsonForms,
  Paths,
  update
} from '@jsonforms/core';

const Dialog = (
  {
    add,
    path,
    schema,
    closeDialog,
    dialogProps,
    schemaService
  }) => (
  <dialog id='dialog' {...dialogProps}>
    <label>
      Select item to create
    </label>
    <div className='dialog-content content'>
      {
        schemaService.getContainmentProperties(schema)
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
                add(path, prop, newData);
                closeDialog();
              }}
            >
              {prop.label}
            </button>
          )
      }
    </div>
    <button
      className='jsf-treeMasterDetail-dialog-close'
      onClick={closeDialog}
    >
      Close
    </button>
  </dialog>
);

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
  null,
  mapDispatchToProps
)(Dialog);

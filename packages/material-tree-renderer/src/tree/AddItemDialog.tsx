// tslint:disable:jsx-no-multiline-js
// tslint:disable:jsx-no-lambda
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  getSchema,
  JsonSchema,
  Paths,
  Resolve,
  update
} from '@jsonforms/core';
import { findPropertyLabel, retrieveContainerProperties } from '../services/property.util';
import { getContainerProperties } from '../reducers';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export interface AddItemDialogProps {
  rootData: any;
  containerProperties: any;
  rootSchema: any;
  path: string;
  schema: JsonSchema;
  closeDialog: any;
  dialogProps: any;
  setSelection: any;
  add?: any;
}

class AddItemDialog extends React.Component<AddItemDialogProps, {}> {

  render() {
    const {
      add,
      path,
      closeDialog,
      dialogProps,
      setSelection,
      rootData,
      /**
       * Self contained schemas of the corresponding schema
       */
      containerProperties
    } = this.props;

    return (
      <Dialog id='dialog' {...dialogProps}>
        <DialogTitle id='dialog-title'>
          Select item to create
        </DialogTitle>
        <DialogContent>
          <List>
            {
              containerProperties
                .map(prop =>
                  <ListItem
                    button
                    key={`${findPropertyLabel(prop)}-button`}
                    onClick={() => {
                      const newData = _.keys(prop.schema.properties).reduce(
                        (d, key) => {
                          if (prop.schema.properties[key].default) {
                            d[key] = prop.schema.properties[key].default;
                          }

                          // FIXME generate id if identifying property
                          // is set in editor to allow id refs
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
                    <ListItemText primary={prop.label} />
                  </ListItem>
                )
            }
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant='outlined' color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const containerProps = getContainerProperties(state);
  let containerProperties;
  if (_.has(containerProps, ownProps.schema.$id)) {
    containerProperties = containerProps[ownProps.schema.$id];
  } else {
    containerProperties = retrieveContainerProperties(ownProps.schema, ownProps.schema);
  }

  return {
    rootData: getData(state),
    containerProperties,
    rootSchema: getSchema(state),
    path: ownProps.path,
    schema: ownProps.schema,
    closeDialog: ownProps.closeDialog,
    dialogProps: ownProps.dialogProps,
    setSelection: ownProps.setSelection
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

export default connect(mapStateToProps, mapDispatchToProps)(AddItemDialog);

import * as _ from 'lodash';
import { INIT, UPDATE_DATA } from '../actions';

export const commonStateReducer = (
  state = {
    data: {},
    schema: {},
    uischema: {}
  },
  action) => {

  switch (action.type) {
    case INIT:
      return {
        data: action.data,
        schema: action.schema,
        uischema: action.uischema
      };
    case UPDATE_DATA: {
      if (action.path === undefined || action.path === null) {
        return state;
      } else if (action.path === '') {
        // empty path is ok
        const result = action.updater(state.data);

        if (result === undefined || result === null) {
          return {
            data: state.data,
            uischema: state.uischema,
            schema: state.schema
          };
        }

        return {
          data: result,
          uischema: state.uischema,
          schema: state.schema
        };
      } else {
        const oldData = _.get(state.data, action.path);
        const newData = action.updater(oldData);
        const newState = _.set(_.cloneDeep(state.data), action.path, newData);

        return {
          data: newState,
          uischema: state.uischema,
          schema: state.schema
        };
      }
    }
    default:
      return state;
  }
};

export const extractData = state => state.data;
export const extractSchema = state => state.schema;
export const extractUiSchema = state => state.uischema;

import * as _ from 'lodash';
import { INIT, UPDATE_DATA, UPDATE_CONFIG } from '../actions';
import { configDefault } from '../configDefault';

const applyDefaultConfiguration = (config: any) => {
  let initConfig;
  if (config) {
    initConfig = _.cloneDeep(config);
    for (const key in configDefault) {
      if (!initConfig[key]) {
        initConfig[key] = _.cloneDeep(configDefault[key]);
      }
    }
  } else {
    initConfig = _.cloneDeep(configDefault);
  }
  return initConfig;
}

export const commonStateReducer = (
  state = {
    data: {},
    schema: {},
    uischema: {},
    config: {}
  },
  action) => {

  switch (action.type) {
    case INIT:
      return {
        data: action.data,
        schema: action.schema,
        uischema: action.uischema,
        config: applyDefaultConfiguration(action.config)
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
            schema: state.schema,
            config: state.config
          };
        }

        return {
          data: result,
          uischema: state.uischema,
          schema: state.schema,
          config: state.config
        };
      } else {
        const oldData = _.get(state.data, action.path);
        const newData = action.updater(oldData);
        const newState = _.set(_.cloneDeep(state.data), action.path, newData);

        return {
          data: newState,
          uischema: state.uischema,
          schema: state.schema,
          config: state.config
        };
      }
    }
    case UPDATE_CONFIG: {
      if (action.path === undefined || action.path === null) {
        return state;
      } else if (action.path === '') {
        // empty path is ok
        const result = action.updater(state.config);

        if (result === undefined || result === null) {
          return {
            data: state.data,
            uischema: state.uischema,
            schema: state.schema,
            config: state.config
          };
        }
        
        return {
          data: state.data,
          uischema: state.uischema,
          schema: state.schema,
          config: applyDefaultConfiguration(result)
        };
      } else {
        const oldConfig = _.get(state.config, action.path);
        const newConfig = action.updater(oldConfig);
        const newState = _.set(applyDefaultConfiguration(state.config), action.path, newConfig);

        return {
          data: state.data,
          uischema: state.uischema,
          schema: state.schema,
          config: newState
        };
      }
    }
    default:
      return {
        data: state.data,
        uischema: state.uischema,
        schema: state.schema,
        config: applyDefaultConfiguration(state.config)
      };
  }
};

export const extractData = state => state.data;
export const extractSchema = state => state.schema;
export const extractUiSchema = state => state.uischema;
export const extractConfig = state => state.config;

import { SET_CONFIG } from '../actions';
import * as _ from 'lodash';
import { configDefault } from '../configDefault';

const applyDefaultConfiguration = (config?: any) => {
  let initConfig;
  if (config) {
    initConfig = _.cloneDeep(config);
    for (const key in configDefault) {
      if (!_.has(initConfig, key)) {
        initConfig[key] = _.cloneDeep(configDefault[key]);
      }
    }
  } else {
    initConfig = _.cloneDeep(configDefault);
  }

  return initConfig;
};

export const configReducer = (
  state = {
    config: applyDefaultConfiguration()
  },
  action) => {
    switch (action.type) {
      case SET_CONFIG:
        return {
          config: applyDefaultConfiguration(action.config)
        };
      default:
        return state;
    }
  };

export const extractConfig = state => state.config;

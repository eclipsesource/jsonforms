import * as _ from 'lodash';
import { SET_CONFIG } from '../actions';
import { configDefault } from '../configDefault';

const applyDefaultConfiguration = (config?: any) => {
  if (config) {
    return _.merge(configDefault, config);
  }

  return configDefault;
};

export const configReducer = (
  state = applyDefaultConfiguration(),
  action) => {
    switch (action.type) {
      case SET_CONFIG:
        return applyDefaultConfiguration(action.config);
      default:
        return state;
    }
  };

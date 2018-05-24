import * as _ from 'lodash';
import { ContainmentProperty } from '../services/schema.service';

/**
 * Determines the ContainmentProperty of the given data object by using the model mapping.
 * If only one ContainmentProperty is given, it is assumed to be the matching one.
 *
 * @param data The data object to match
 * @param properties The array of ContainmentProperties
 * @param modelMapping The model mapping used to match the data to a containment property
 * @return The matching {@link ContainmentProperty}
 */
// TODO type model mapping
export const matchContainmentProperty =
  (data: Object, properties: ContainmentProperty[], modelMapping: any) => {
  if (properties.length === 1) {
    return properties[0];
  }
  if (!_.isEmpty(modelMapping) &&
    !_.isEmpty(modelMapping.mapping)) {
    const filtered = properties.filter(property => {
      // only use filter criterion if the checked value has the mapped attribute
      if (data[modelMapping.attribute]) {
        return property.schema.id === modelMapping.mapping[data[modelMapping.attribute]];
      }

      // NOTE if mapped attribute is not present do not filter out property
      return true;
    });
    // TODO improve handling
    if (filtered.length > 1) {
      console.warn('More than one matching containment property was found for the given data',
                   data);
    }

    return _.head(filtered);
  }
};

export interface StringMap {
  [property: string]: string;
}

export interface ModelMapping {
  attribute: string;
  mapping: StringMap;
}

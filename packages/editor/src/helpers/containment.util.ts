import * as _ from 'lodash';
import { Property } from '../services/container.service';

/**
 * Determines the container Property of the given data object by using the model mapping.
 * If only one container Property is given, it is assumed to be the matching one.
 *
 * @param data The data object to match
 * @param properties The array of container Properties
 * @param modelMapping The model mapping used to match the data to a container property
 * @return The matching {@link Property}
 */
// TODO type model mapping
export const matchContainmentProperty =
  (data: Object, properties: Property[], filterPredicate: any) => {
    // TODO improve handling
    const filtered = properties.filter(filterPredicate(data));
    if (filtered.length > 1) {
      console.warn('More than one matching container property was found for the given data',
                   data);
    }

    return _.head(filtered);
};

export interface StringMap {
  [property: string]: string;
}

export interface ModelMapping {
  attribute: string;
  mapping: StringMap;
}

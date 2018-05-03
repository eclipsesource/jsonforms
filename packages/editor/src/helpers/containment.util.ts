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
  (data: Object, properties: ContainmentProperty[], filterPredicate: any) => {
    // TODO improve handling
    const filtered = properties.filter(filterPredicate(data));
    if (filtered.length > 1) {
      console.warn('More than one matching containment property was found for the given data',
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

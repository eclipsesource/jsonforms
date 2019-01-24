import head from 'lodash/head';
import { Property } from '../services/property.util';

/**
 * Determines the properties of the given data object by using the model mapping.
 * If only one property is given, it is assumed to be the matching one.
 *
 * @param data The data object to match
 * @param properties The array of properties of root schema
 * @param filterPredicate used to filter properties of the given data
 * @return The matching {@link Property}
 */
export const matchContainerProperty = (
  data: Object,
  properties: Property[],
  filterPredicate: any
) => {
  // TODO improve handling
  const filtered = properties.filter(filterPredicate(data));
  if (filtered.length > 1) {
    console.warn(
      'More than one matching container property was found for the given data',
      data
    );
  }

  return head(filtered);
};

export interface StringMap {
  [property: string]: string;
}

export interface ModelMapping {
  attribute: string;
  mapping: StringMap;
}

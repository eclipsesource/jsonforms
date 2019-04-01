/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
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

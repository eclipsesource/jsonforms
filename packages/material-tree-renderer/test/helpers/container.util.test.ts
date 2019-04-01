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
import * as _ from 'lodash';
import { matchContainerProperty } from '../../src/helpers/container.util';
import { Property } from '../../src/services/property.util';
import { JsonSchema, JsonSchema7 } from '@jsonforms/core';

const modelMapping: {
  attribute: string;
  mapping: { [key: string]: string };
} = {
  attribute: 'type',
  mapping: {
    person: '#person',
    robot: '#robot'
  }
};
const matchingStrategy = (data: { [key: string]: string }) => {
  return (property: Property): boolean => {
    if (!_.isEmpty(modelMapping) && !_.isEmpty(modelMapping.mapping)) {
      if (data[modelMapping.attribute]) {
        return (
          property.schema.$id ===
          modelMapping.mapping[_.toLower(data[modelMapping.attribute])]
        );
      }

      return true;
    }
  };
};

describe('Containment Util Tests', () => {
  test('find proper containment property based on a matching strategy ', () => {
    const innerSchema: JsonSchema7 = {
      type: 'object',
      properties: {
        type: {
          type: 'string'
        }
      }
    };
    const firstProperty: Property = {
      property: 'person',
      label: 'root',
      schema: { ...innerSchema, ...{ $id: '#person' } }
    };
    const secondProperty: Property = {
      property: 'robot',
      label: 'root',
      schema: { ...innerSchema, ...{ $id: '#robot' } }
    };

    const containerProperties: Property[] = [firstProperty, secondProperty];

    let prop = matchContainerProperty(
      { type: 'robot' },
      containerProperties,
      matchingStrategy
    );
    expect(prop.schema).toMatchObject({ ...innerSchema, ...{ $id: '#robot' } });
    prop = matchContainerProperty(
      { type: 'person' },
      containerProperties,
      matchingStrategy
    );
    expect(prop.schema).toMatchObject({
      ...innerSchema,
      ...{ $id: '#person' }
    });
  });

  test('return empty array if there is no match ', () => {
    const innerSchema: JsonSchema7 = {
      type: 'object',
      properties: {
        type: {
          type: 'string'
        }
      }
    };
    const firstProperty: Property = {
      property: 'person',
      label: 'root',
      schema: { ...innerSchema, ...{ $id: '#person' } }
    };

    const containerProperties: Property[] = [firstProperty];

    const prop = matchContainerProperty(
      { type: 'robot' },
      containerProperties,
      matchingStrategy
    );
    expect(prop).toBeUndefined();
  });

  test('return the first property if there are more than 1 match ', () => {
    const firstInnerSchema: JsonSchema = {
      type: 'object',
      $id: '#robot',
      properties: {
        type: {
          type: 'string'
        },
        name: {
          type: 'string'
        }
      }
    };
    const secondInnerSchema: JsonSchema = {
      type: 'object',
      $id: '#robot',
      properties: {
        type: {
          type: 'string'
        }
      }
    };
    const firstProperty: Property = {
      property: 'robot',
      label: 'root',
      schema: firstInnerSchema
    };
    const secondProperty: Property = {
      property: 'robot',
      label: 'root',
      schema: secondInnerSchema
    };

    const containerProperties: Property[] = [firstProperty, secondProperty];
    const prop = matchContainerProperty(
      { type: 'robot' },
      containerProperties,
      matchingStrategy
    );
    expect(prop.schema).toEqual(firstInnerSchema);
  });
});

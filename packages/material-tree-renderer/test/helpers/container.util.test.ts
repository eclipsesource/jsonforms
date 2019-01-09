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

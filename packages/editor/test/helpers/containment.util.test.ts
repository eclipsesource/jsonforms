import * as _ from 'lodash';
import { matchContainmentProperty } from '../../src/helpers/containment.util';
import { ContainmentProperty, ContainmentPropertyImpl } from '../../src/services/schema.service';
import { JsonSchema } from '@jsonforms/core';

const modelMapping = {
  attribute: 'type',
  mapping: {
    'person': '#person',
    'robot': '#robot'
  }
};
const matchingStrategy = (data: Object) => {
  return (property: ContainmentProperty): boolean => {
    if (!_.isEmpty(modelMapping) &&
      !_.isEmpty(modelMapping.mapping)) {
      if (data[modelMapping.attribute]) {
        return property.schema.id === modelMapping.
          mapping[_.toLower(data[modelMapping.attribute])];
      }

      return true;
    }
  };
};

describe('Containment Util Tests', () => {
  test('find proper containment property based on a matching strategy ', () => {
    const innerSchema: JsonSchema = {
      type: 'object',
      properties: {
        type: {
          type: 'string'
        }
      }
    };
    const containmentProperties: ContainmentProperty[] = [
      new ContainmentPropertyImpl({...innerSchema, ...{id: '#person'}},
        'root', 'person', null, null, null),
      new ContainmentPropertyImpl({...innerSchema, ...{id: '#robot'}},
        'root', 'robot', null, null, null)
    ];
    let prop = matchContainmentProperty({type: 'robot'}, containmentProperties, matchingStrategy);
    expect(prop.schema).toMatchObject({...innerSchema, ...{id: '#robot'}});
    prop = matchContainmentProperty({type: 'person'}, containmentProperties, matchingStrategy);
    expect(prop.schema).toMatchObject({...innerSchema, ...{id: '#person'}});
  });

  test('return empty array if there is no match ', () => {
    const innerSchema: JsonSchema = {
      type: 'object',
      properties: {
        type: {
          type: 'string'
        }
      }
    };
    const containmentProperties: ContainmentProperty[] = [
      new ContainmentPropertyImpl({...innerSchema, ...{id: '#person'}},
        'root', 'person', null, null, null)
    ];
    const prop = matchContainmentProperty({type: 'robot'}, containmentProperties, matchingStrategy);
    expect(prop).toEqual(undefined);
  });

  test('return the first property if there are more than 1 match ', () => {
    const firstInnerSchema: JsonSchema = {
      type: 'object',
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
      properties: {
        type: {
          type: 'string'
        }
      }
    };
    const containmentProperties: ContainmentProperty[] = [
      new ContainmentPropertyImpl({...firstInnerSchema, ...{id: '#robot'}},
        'root', 'robot', null, null, null),
      new ContainmentPropertyImpl({...secondInnerSchema, ...{id: '#robot'}},
        'root', 'robot', null, null, null)
    ];
    const prop = matchContainmentProperty({type: 'robot'}, containmentProperties, matchingStrategy);
    expect(prop.schema).toEqual({...firstInnerSchema, ...{id: '#robot'}});
  });
});

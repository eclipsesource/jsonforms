import { createEditorStore } from '../../src/helpers/util';
import { addModelSchema, getModelSchema } from '../../src/reducers';
import { JsonSchema } from '@jsonforms/core';

describe('Adding Model Schema Tests', () => {
  test('Add model schema during store initialization', () => {
    const modelSchema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    };
    const store = createEditorStore({}, {}, {}, {}, {}, {}, {}, {}, {}, modelSchema);
    expect(modelSchema).toMatchObject(getModelSchema(store.getState()));
  });

  test('Add model schema with an action', () => {
    const modelSchema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    };
    const store = createEditorStore({}, {}, {}, {}, {}, {}, {}, {}, {}, {});
    store.dispatch(addModelSchema(modelSchema));
    expect(modelSchema).toMatchObject(getModelSchema(store.getState()));
  });
});

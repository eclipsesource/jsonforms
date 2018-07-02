import { Actions, jsonformsReducer } from '@jsonforms/core';
import {
  getContainerProperties,
  setContainerProperties,
  treeWithDetailReducer
} from '../../src/reducers';
import { findAllContainerProperties } from '../../src/services/property.util';
import { combineReducers, createStore, Store } from 'redux';

export const createEditorStore = (
  data = {},
  schema,
  uischema,
  fields,
  renderers,
  imageMapping?,
  labelMapping?,
  modelMapping?,
  uiSchemata = {},
  containerProperties = {}): Store<any> => {
  const store = createStore(
    combineReducers({ jsonforms: jsonformsReducer({ treeWithDetail: treeWithDetailReducer }) }),
    {
      jsonforms: {
        renderers,
        fields,
        treeWithDetail: {
          imageMapping,
          labelMapping,
          modelMapping,
          uiSchemata,
          containerProperties
        }
      }
    }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

const taskSchema = {
  'type': 'object',
  '$id': '#userGroup',
  'properties': {
    '_type': {
      'type': 'string',
      'default': 'userGroup'
    },
    'label': {
      'type': 'string'
    },
    'users': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/user'
      }
    }
  },
  'additionalProperties': false,
  'definitions': {
    'task': {
      'type': 'object',
      '$id': '#task',
      'properties': {
        'type': {
          'type': 'string',
          'default': 'task'
        },
        'name': {
          'type': 'string'
        },
        'subTasks': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/task'
          }
        }
      },
      'required': [ 'name', 'priority' ],
      'additionalProperties': false
    },
    'user': {
      'type': 'object',
      '$id': '#user',
      'properties': {
        'type': {
          'type': 'string',
          'default': 'user'
        },
        'name': {
          'type': 'string'
        },
        'birthday': {
          'type': 'string',
          'format': 'date'
        },
        'tasks': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/task'
          }
        }
      },
      'required': [ 'name' ],
      'additionalProperties': false
    }
  }
};

const expectedProps = {
  '#userGroup': [
    {
      'property': 'users',
      'label': 'user',
      'schema': {
        'type': 'object',
        '$id': '#user',
        'properties': {
          'type': {
            'type': 'string',
            'default': 'user'
          },
          'name': {
            'type': 'string'
          },
          'birthday': {
            'type': 'string',
            'format': 'date'
          },
          'tasks': {
            'type': 'array',
            'items': {
              '$ref': '#/definitions/task'
            }
          }
        },
        'required': [
          'name'
        ],
        'additionalProperties': false,
        'definitions': {
          'task': {
            'type': 'object',
            '$id': '#task',
            'properties': {
              'type': {
                'type': 'string',
                'default': 'task'
              },
              'name': {
                'type': 'string'
              },
              'subTasks': {
                'type': 'array',
                'items': {
                  '$ref': '#/definitions/task'
                }
              }
            },
            'required': [
              'name',
              'priority'
            ],
            'additionalProperties': false
          }
        }
      }
    }
  ],
  '#user': [
    {
      'property': 'tasks',
      'label': 'task',
      'schema': {
        'type': 'object',
        '$id': '#task',
        'properties': {
          'type': {
            'type': 'string',
            'default': 'task'
          },
          'name': {
            'type': 'string'
          },
          'subTasks': {
            'type': 'array',
            'items': {
              '$ref': '#/definitions/task'
            }
          }
        },
        'required': [
          'name',
          'priority'
        ],
        'additionalProperties': false,
        'definitions': {
          'task': {
            'type': 'object',
            '$id': '#task',
            'properties': {
              'type': {
                'type': 'string',
                'default': 'task'
              },
              'name': {
                'type': 'string'
              },
              'subTasks': {
                'type': 'array',
                'items': {
                  '$ref': '#/definitions/task'
                }
              }
            },
            'required': [
              'name',
              'priority'
            ],
            'additionalProperties': false
          }
        }
      }
    }
  ],
  '#task': [
    {
      'property': 'subTasks',
      'label': 'task',
      'schema': {
        'type': 'object',
        '$id': '#task',
        'properties': {
          'type': {
            'type': 'string',
            'default': 'task'
          },
          'name': {
            'type': 'string'
          },
          'subTasks': {
            'type': 'array',
            'items': {
              '$ref': '#/definitions/task'
            }
          }
        },
        'required': [
          'name',
          'priority'
        ],
        'additionalProperties': false,
        'definitions': {
          'task': {
            'type': 'object',
            '$id': '#task',
            'properties': {
              'type': {
                'type': 'string',
                'default': 'task'
              },
              'name': {
                'type': 'string'
              },
              'subTasks': {
                'type': 'array',
                'items': {
                  '$ref': '#/definitions/task'
                }
              }
            },
            'required': [
              'name',
              'priority'
            ],
            'additionalProperties': false
          }
        }
      }
    }
  ]
};

describe('Editor Reducers Tests', () => {
  test('Set the container properties of the given schema into store by dispatching action', () => {
    const store = createEditorStore({}, taskSchema, {}, {}, {}, {}, {}, {}, {}, {});
    const props = findAllContainerProperties(taskSchema, taskSchema);
    store.dispatch(setContainerProperties(props));

    expect(expectedProps).toMatchObject(getContainerProperties(store.getState()));
  });

  test('Initialize store with the container properties of the given schema', () => {
    const props = findAllContainerProperties(taskSchema, taskSchema);
    const store = createEditorStore({}, taskSchema, {}, {}, {}, {}, {}, {}, {}, props);

    expect(expectedProps).toMatchObject(getContainerProperties(store.getState()));
  });
});

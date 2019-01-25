/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import { init, update, UPDATE_DATA, UpdateAction } from '../../src/actions';
import test from 'ava';
import * as Redux from 'redux';
import {
  clearAllIds,
  createAjv,
  createDefaultValue,
  mapDispatchToArrayControlProps,
  mapDispatchToControlProps,
  mapStateToControlProps,
  mapStateToJsonFormsRendererProps,
  mapStateToLayoutProps,
  OwnPropsOfControl
} from '../../src/util';
import configureStore from 'redux-mock-store';
import * as _ from 'lodash';
import { generateDefaultUISchema } from '../../src/generators';
import {
  ControlElement,
  coreReducer,
  JsonFormsState,
  JsonSchema,
  RuleEffect,
  UISchemaElement
} from '../../src';
import { jsonformsReducer } from '../../src/reducers';
import { ErrorObject } from 'ajv';
import { combineReducers, createStore, Store } from 'redux';

const middlewares: Redux.Middleware[] = [];
const mockStore = configureStore<JsonFormsState>(middlewares);

const hideRule = {
  effect: RuleEffect.HIDE,
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer'
  }
};

const disableRule = {
  effect: RuleEffect.DISABLE,
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer'
  }
};

const coreUISchema: ControlElement = {
  type: 'Control',
  scope: '#/properties/firstName'
};

const createState = (uischema: UISchemaElement) => ({
  jsonforms: {
    core: {
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' }
        }
      },
      data: {
        firstName: 'Homer'
      },
      uischema,
      errors: [] as ErrorObject[]
    }
  }
});

test('mapStateToControlProps - visible via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    visible: true,
    uischema
  };
  const props = mapStateToControlProps(createState(uischema), ownProps);
  t.true(props.visible);
});

test('mapStateToControlProps - hidden via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    visible: false,
    uischema
  };
  const props = mapStateToControlProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToControlProps - hidden via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema
  };
  const props = mapStateToControlProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToControlProps - visible via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToControlProps(clonedState, ownProps);
  t.true(props.visible);
});

test('mapStateToControlProps - visible via state with path from ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema,
    path: 'foo'
  };
  const state = {
    jsonforms: {
      core: {
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        },
        data: {
          foo: { firstName: 'Lisa' }
        },
        uischema,
        errors: [] as ErrorObject[]
      }
    }
  };
  const props = mapStateToControlProps(state, ownProps);
  t.true(props.visible);
});

test('mapStateToControlProps - enabled via state with path from ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    visible: true,
    uischema,
    path: 'foo'
  };
  const state = {
    jsonforms: {
      core: {
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        },
        data: {
          foo: { firstName: 'Lisa' }
        },
        uischema,
        errors: [] as ErrorObject[]
      }
    }
  };
  const props = mapStateToControlProps(state, ownProps);
  t.true(props.enabled);
});

test('mapStateToControlProps - enabled via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    enabled: true,
    uischema
  };
  const props = mapStateToControlProps(createState(uischema), ownProps);
  t.true(props.enabled);
});

test('mapStateToControlProps - disabled via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    enabled: false,
    uischema
  };
  const props = mapStateToControlProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToControlProps - disabled via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    uischema
  };
  const props = mapStateToControlProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToControlProps - enabled via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    uischema
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToControlProps(clonedState, ownProps);
  t.true(props.enabled);
});

test('mapStateToControlProps - path', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToControlProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'firstName');
});

test('mapStateToControlProps - compose path with ownProps.path', t => {
  const ownProps = {
    uischema: coreUISchema,
    path: 'yo'
  };
  const props = mapStateToControlProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'yo.firstName');
  t.is(props.parentPath, 'yo');
});

test('mapStateToControlProps - derive label', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToControlProps(createState(coreUISchema), ownProps);
  t.is(props.label, 'First Name');
});

test('mapStateToControlProps - derive label', t => {
  const ownProps = {
    uischema: {
      ...coreUISchema,
      label: {
        show: false
      }
    }
  };
  const props = mapStateToControlProps(createState(coreUISchema), ownProps);
  t.is(props.label, '');
});

test('mapStateToControlProps - data', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToControlProps(createState(coreUISchema), ownProps);
  t.is(props.data, 'Homer');
});

test('mapStateToControlProps - errors', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const clonedState = _.cloneDeep(createState(coreUISchema));
  const error: ErrorObject = {
    dataPath: 'firstName',
    message: 'Duff beer',
    keyword: 'whatever',
    schemaPath: '',
    params: undefined
  };
  clonedState.jsonforms.core.errors = [error];
  const props = mapStateToControlProps(clonedState, ownProps);
  t.is(props.errors[0], 'Duff beer');
});

test('mapStateToControlProps - no duplicate error messages', t => {
  const schema = {
    type: 'object',
    properties: {
      firstName: {
        anyOf: [
          { type: 'string', minLength: 5 },
          { type: 'string', enum: ['foo', 'bar'] }
        ]
      }
    }
  };
  const initCoreState = coreReducer(undefined, init({}, schema, coreUISchema));
  const updateCoreState = coreReducer(
    initCoreState,
    update('firstName', () => true)
  );
  const props = mapStateToControlProps(
    { jsonforms: { core: updateCoreState } },
    { uischema: coreUISchema }
  );
  // 'should be string' should only appear once
  t.is(props.errors.length, 3);
});

test('mapStateToControlProps - id', t => {
  clearAllIds();
  const ownProps = {
    uischema: coreUISchema,
    id: '#/properties/firstName'
  };
  const props = mapStateToControlProps(createState(coreUISchema), ownProps);
  t.is(props.id, '#/properties/firstName');
});

test('mapDispatchToControlProps', t => {
  const store = mockStore(createState(coreUISchema));
  const props = mapDispatchToControlProps(store.dispatch);
  props.handleChange('foo', 42);
  const updateAction = _.head<any>(store.getActions()) as UpdateAction;
  t.is(updateAction.type, UPDATE_DATA);
  t.is(updateAction.path, 'foo');
  t.is(updateAction.updater(), 42);
});

test('createDefaultValue', t => {
  t.true(
    _.isDate(
      createDefaultValue({
        type: 'string',
        format: 'date'
      })
    )
  );
  t.true(
    _.isDate(
      createDefaultValue({
        type: 'string',
        format: 'date-time'
      })
    )
  );
  t.true(
    _.isDate(
      createDefaultValue({
        type: 'string',
        format: 'time'
      })
    )
  );
  t.is(createDefaultValue({ type: 'string' }), '');
  t.is(createDefaultValue({ type: 'number' }), 0);
  t.falsy(createDefaultValue({ type: 'boolean' }));
  t.is(createDefaultValue({ type: 'integer' }), 0);
  t.deepEqual(createDefaultValue({ type: 'array' }), []);
  t.is(createDefaultValue({ type: 'null' }), null);
  t.deepEqual(createDefaultValue({ type: 'object' }), {});
  t.deepEqual(createDefaultValue({ type: 'something' }), {});
});

test(`mapStateToDispatchRendererProps should generate UI schema given ownProps schema`, t => {
  const store = mockStore(createState(coreUISchema));
  const schema = {
    type: 'object',
    properties: {
      bar: {
        type: 'number'
      }
    }
  };

  const props = mapStateToJsonFormsRendererProps(store.getState(), { schema });
  t.deepEqual(props.uischema, generateDefaultUISchema(schema));
});

test(`mapStateToDispatchRendererProps should use registered UI schema given no ownProps`, t => {
  const store = mockStore(createState(coreUISchema));
  const props = mapStateToJsonFormsRendererProps(store.getState(), {});
  t.deepEqual(props.uischema, coreUISchema);
});

test(`mapStateToDispatchRendererProps should use UI schema if given via ownProps`, t => {
  const store = mockStore(createState(coreUISchema));
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      },
      bar: {
        type: 'number'
      }
    }
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };

  const props = mapStateToJsonFormsRendererProps(store.getState(), {
    schema,
    uischema
  });
  t.deepEqual(props.uischema, uischema);
});

test('mapDispatchToArrayControlProps should adding items to array', t => {
  const data: any = ['foo'];
  const schema: JsonSchema = {
    type: 'array',
    items: {
      type: 'string'
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        uischema,
        schema,
        data,
        errors: [] as ErrorObject[]
      }
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    initState
  );
  store.dispatch(init(data, schema, uischema));
  const ownProps: OwnPropsOfControl = {
    schema,
    uischema
  };
  const props = mapDispatchToArrayControlProps(store.dispatch, ownProps);
  props.addItem('')();
  t.is(store.getState().jsonforms.core.data.length, 2);
});

test('mapDispatchToArrayControlProps should remove items from array', t => {
  const data = ['foo', 'bar', 'quux'];
  const schema: JsonSchema = {
    type: 'array',
    items: {
      type: 'string'
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        uischema,
        schema,
        data,
        errors: [] as ErrorObject[]
      }
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    initState
  );
  store.dispatch(init(data, schema, uischema));
  const ownProps: OwnPropsOfControl = {
    schema,
    uischema
  };
  const props = mapDispatchToArrayControlProps(store.dispatch, ownProps);
  props.removeItems('', ['foo', 'bar'])();
  t.is(store.getState().jsonforms.core.data.length, 1);
  t.is(store.getState().jsonforms.core.data[0], 'quux');
});

test('mapStateToLayoutProps - visible via state with path from ownProps ', t => {
  const uischema = {
    type: 'VerticalLayout',
    elements: [coreUISchema],
    rule: hideRule
  };
  const ownProps = {
    uischema,
    path: 'foo'
  };
  const state = {
    jsonforms: {
      core: {
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        },
        data: {
          foo: { firstName: 'Lisa' }
        },
        uischema,
        errors: [] as ErrorObject[]
      }
    }
  };
  const props = mapStateToLayoutProps(state, ownProps);
  t.true(props.visible);
});

test('mapStateToLayoutProps - hidden via state with path from ownProps ', t => {
  const uischema = {
    type: 'VerticalLayout',
    elements: [coreUISchema],
    rule: hideRule
  };
  const ownProps = {
    uischema,
    path: 'foo'
  };
  const state = {
    jsonforms: {
      core: {
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        },
        data: {
          foo: { firstName: 'Homer' }
        },
        uischema,
        errors: [] as ErrorObject[]
      }
    }
  };
  const props = mapStateToLayoutProps(state, ownProps);
  t.false(props.visible);
});

test('should assign defaults to enum', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      color: {
        type: 'string',
        enum: ['red', 'green', 'blue'],
        default: 'green'
      }
    }
  };

  const uischema: UISchemaElement = undefined;

  const data = {
    name: 'foo'
  };

  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        uischema,
        schema,
        data,
        errors: [] as ErrorObject[]
      }
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    initState
  );
  store.dispatch(
    init(data, schema, uischema, createAjv({ useDefaults: true }))
  );

  t.is(store.getState().jsonforms.core.data.color, 'green');
});

test('should assign defaults to empty item within nested object of an array', t => {
  const schema: JsonSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          default: 'foo'
        }
      }
    }
  };

  const uischema: ControlElement = {
    type: 'Control',
    scope: '#'
  };

  const data = [{}];

  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        uischema,
        schema,
        data,
        errors: [] as ErrorObject[]
      }
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    initState
  );
  store.dispatch(
    init(data, schema, uischema, createAjv({ useDefaults: true }))
  );

  t.is(store.getState().jsonforms.core.data.length, 1);
  t.deepEqual(store.getState().jsonforms.core.data[0], { message: 'foo' });
});

test('should assign defaults to newly added item within nested object of an array', t => {
  const schema: JsonSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          default: 'foo'
        }
      }
    }
  };

  const uischema: ControlElement = {
    type: 'Control',
    scope: '#'
  };

  const data = [{}];

  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        uischema,
        schema,
        data,
        errors: [] as ErrorObject[]
      }
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    initState
  );
  store.dispatch(
    init(data, schema, uischema, createAjv({ useDefaults: true }))
  );
  const ownProps: OwnPropsOfControl = {
    schema,
    uischema
  };
  const props = mapDispatchToArrayControlProps(store.dispatch, ownProps);

  props.addItem('')();

  t.is(store.getState().jsonforms.core.data.length, 2);
  t.deepEqual(store.getState().jsonforms.core.data[1], { message: 'foo' });
});

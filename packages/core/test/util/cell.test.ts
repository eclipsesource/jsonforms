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
import test from 'ava';
import * as _ from 'lodash';
import * as Redux from 'redux';
import {
  clearAllIds,
  defaultMapDispatchToControlProps,
  defaultMapStateToEnumCellProps,
  DispatchPropsOfCell,
  mapStateToCellProps,
  mapStateToOneOfEnumCellProps,
  oneOfToEnumOptionMapper,
} from '../../src/util';
import { UPDATE_DATA, UpdateAction } from '../../src/actions';
import configureStore from 'redux-mock-store';
import {
  ControlElement,
  createAjv,
  JsonFormsState,
  JsonSchema,
  RuleEffect,
  UISchemaElement,
  validate,
} from '../../src';
import { enumToEnumOptionMapper } from '../../src/util/renderer';

const middlewares: Redux.Middleware[] = [];
const mockStore = configureStore<JsonFormsState>(middlewares);

const hideRule = {
  effect: RuleEffect.HIDE,
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer',
  },
};

const disableRule = {
  effect: RuleEffect.DISABLE,
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer',
  },
};

const enableRule = {
  effect: RuleEffect.ENABLE,
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer',
  },
};

const coreUISchema: ControlElement = {
  type: 'Control',
  scope: '#/properties/firstName',
};

const createState = (uischema: UISchemaElement): JsonFormsState => ({
  jsonforms: {
    core: {
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          nationality: {
            type: 'string',
            enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
          },
        },
      },
      data: {
        firstName: 'Homer',
      },
      uischema,
      errors: [],
    },
  },
});

test('mapStateToCellProps - visible via ownProps ', (t) => {
  const uischema: ControlElement = {
    ...coreUISchema,
    rule: hideRule,
  };
  const ownProps = {
    visible: true,
    uischema,
  };
  const props = mapStateToCellProps(createState(uischema), ownProps);
  t.true(props.visible);
});

test('mapStateToCellProps - hidden via ownProps ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule,
  };
  const ownProps = {
    visible: false,
    uischema,
  };
  const props = mapStateToCellProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToCellProps - hidden via state ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule,
  };
  const ownProps = {
    uischema,
  };
  const props = mapStateToCellProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToCellProps - visible via state ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule,
  };
  const ownProps = {
    uischema,
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToCellProps(clonedState, ownProps);
  t.true(props.visible);
});

test('mapStateToCellProps - enabled via ownProps ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule,
  };
  const ownProps = {
    enabled: true,
    uischema,
  };
  const props = mapStateToCellProps(createState(uischema), ownProps);
  t.true(props.enabled);
});

test('mapStateToCellProps - disabled via ownProps ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule,
  };
  const ownProps = {
    enabled: false,
    uischema,
  };
  const props = mapStateToCellProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToCellProps - disabled via state ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule,
  };
  const ownProps = {
    uischema,
  };
  const props = mapStateToCellProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToCellProps - enabled via state ', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule,
  };
  const ownProps = {
    uischema,
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToCellProps(clonedState, ownProps);
  t.true(props.enabled);
});

test('mapStateToCellProps - disabled via global readonly', (t) => {
  const ownProps = {
    uischema: coreUISchema,
  };
  const state: JsonFormsState = createState(coreUISchema);
  state.jsonforms.readonly = true;

  const props = mapStateToCellProps(state, ownProps);
  t.false(props.enabled);
});

test('mapStateToCellProps - disabled via global readonly beats enabled via ownProps', (t) => {
  const ownProps = {
    uischema: coreUISchema,
    enabled: true,
  };
  const state: JsonFormsState = createState(coreUISchema);
  state.jsonforms.readonly = true;

  const props = mapStateToCellProps(state, ownProps);
  t.false(props.enabled);
});

test('mapStateToCellProps - disabled via global readonly beats enabled via rule', (t) => {
  const uischema = {
    ...coreUISchema,
    rule: enableRule,
  };
  const ownProps = {
    uischema,
  };
  const state: JsonFormsState = createState(uischema);
  state.jsonforms.readonly = true;

  const props = mapStateToCellProps(state, ownProps);
  t.false(props.enabled);
});

test('mapStateToCellProps - path', (t) => {
  const ownProps = {
    uischema: coreUISchema,
    path: 'firstName',
  };
  const props = mapStateToCellProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'firstName');
});

test('mapStateToCellProps - data', (t) => {
  const ownProps = {
    uischema: coreUISchema,
    path: 'firstName',
  };
  const props = mapStateToCellProps(createState(coreUISchema), ownProps);
  t.is(props.data, 'Homer');
});

test('mapStateToCellProps - id', (t) => {
  clearAllIds();
  const ownProps = {
    uischema: coreUISchema,
    id: '#/properties/firstName',
  };
  const props = mapStateToCellProps(createState(coreUISchema), ownProps);
  t.is(props.id, '#/properties/firstName');
});

test('mapStateToCellProps - translated error', (t) => {
  const ownProps = {
    uischema: coreUISchema,
    id: '#/properties/firstName',
    path: 'firstName',
  };
  const state = createState(coreUISchema);
  if (state.jsonforms.core === undefined) {
    fail('Failed to create jsonforms core state');
  }
  const schema = state.jsonforms.core?.schema as JsonSchema;
  const data = state.jsonforms.core?.data as any;
  // mark firstName as required, delete the value from data, then get errors from ajv from the compiled schema
  schema.required = ['firstName'];
  delete data.firstName;
  const ajv = createAjv();
  const v = ajv.compile(schema);
  state.jsonforms.core.errors = validate(v, data);
  // add a mock i18n state to verify that the error gets translated
  state.jsonforms.i18n = {
    translateError: (error) => `i18n-error:${error.keyword}`,
  };
  const props = mapStateToCellProps(state, ownProps);
  t.is(props.errors, 'i18n-error:required');
});

test('mapStateToEnumCellProps - set default options for dropdown list', (t) => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const ownProps = {
    schema: {
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
    uischema,
    path: 'nationality',
  };

  const props = defaultMapStateToEnumCellProps(createState(uischema), ownProps);
  t.deepEqual(
    props.options,
    ['DE', 'IT', 'JP', 'US', 'RU', 'Other'].map((e) =>
      enumToEnumOptionMapper(e)
    )
  );
  t.is(props.data, undefined);
});

test('mapStateToOneOfEnumCellProps - set one of options for dropdown list', (t) => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/country',
  };
  const ownProps = {
    schema: {
      oneOf: [
        {
          const: 'AU',
          title: 'Australia',
        },
        {
          const: 'NZ',
          title: 'New Zealand',
        },
      ],
    },
    uischema,
    path: 'country',
  };

  const props = mapStateToOneOfEnumCellProps(createState(uischema), ownProps);
  t.deepEqual(
    props.options,
    [
      { title: 'Australia', const: 'AU' },
      { title: 'New Zealand', const: 'NZ' },
    ].map((schema) => oneOfToEnumOptionMapper(schema))
  );
  t.is(props.data, undefined);
});

test('defaultMapDispatchToControlProps, initialized with custom handleChange', (t) => {
  let didChange = false;
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const ownProps = {
    handleChange: () => {
      didChange = true;
    },
  };
  const store = mockStore(createState(uiSchema));
  const props: DispatchPropsOfCell = defaultMapDispatchToControlProps(
    store.dispatch,
    ownProps
  );
  props.handleChange(undefined, undefined);
  t.true(didChange);
});

test('defaultMapDispatchToControlProps, with default handleChange', (t) => {
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const store = mockStore(createState(uiSchema));
  const props = defaultMapDispatchToControlProps(store.dispatch, {});
  props.handleChange('nationality', 'DE');
  const updateAction = _.head<any>(store.getActions()) as UpdateAction;
  t.is(updateAction.type, UPDATE_DATA);
  t.is(updateAction.path, 'nationality');
  t.is(updateAction.updater(), 'DE');
});

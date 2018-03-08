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
import test from 'ava';
import * as _ from 'lodash';
import { mapDispatchToControlProps, mapStateToControlProps } from '../../src/util';
import configureStore from 'redux-mock-store';
import { UPDATE_DATA, UpdateAction } from '../../src/actions';

const middlewares = [];
const mockStore = configureStore(middlewares);

const hideRule = {
  effect: 'HIDE',
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer'
  }
};

const disableRule = {
  effect: 'DISABLE',
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer'
  }
};

const coreUISchema = {
  type: 'Control',
  scope: '#/properties/firstName',
};

const createState = uischema => ({
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
      errors: []
    },
    i18n: {
      locale: 'en-US'
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
  clonedState.jsonforms.core.errors = [{
    dataPath: 'firstName',
    message: 'Duff beer'
  }];
  const props = mapStateToControlProps(clonedState, ownProps);
  t.is(props.errors[0], 'Duff beer');
});

test('mapStateToControlProps - id', t => {
  const ownProps = {
    uischema: coreUISchema
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

import test from 'ava';
import * as _ from 'lodash';
import { mapStateToFieldProps } from '../../src/util';

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
  }
});

test('mapStateToFieldProps - visible via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    visible: true,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.true(props.visible);
});

test('mapStateToFieldProps - hidden via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    visible: false,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToFieldProps - hidden via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToFieldProps - visible via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToFieldProps(clonedState, ownProps);
  t.true(props.visible);
});

test('mapStateToFieldProps - enabled via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    enabled: true,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.true(props.enabled);
});

test('mapStateToFieldProps - disabled via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    enabled: false,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToFieldProps - disabled via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToFieldProps - enabled via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    uischema
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToFieldProps(clonedState, ownProps);
  t.true(props.enabled);
});

test('mapStateToFieldProps - path', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'firstName');
});

test('mapStateToFieldProps - compose path with ownProps.path', t => {
  const ownProps = {
    uischema: coreUISchema,
    path: 'yo'
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'yo.firstName');
});

test('mapStateToFieldProps - data', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.data, 'Homer');
});

test('mapStateToFieldProps - id', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.id, '#/properties/firstName');
});

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
import {
  AndCondition,
  ControlElement,
  createAjv,
  hasReadonlyRule,
  isInherentlyEnabled,
  isInherentlyReadonly,
  isReadonly,
  JsonFormsCore,
  LeafCondition,
  OrCondition,
  RuleEffect,
  SchemaBasedCondition,
  ValidateFunctionCondition,
  ValidateFunctionContext,
} from '../../src';
import {
  evalEnablement,
  evalReadonly,
  evalVisibility,
  isVisible,
  matchesConditionSchema,
} from '../../src/util/runtime';
import type { FormValidator } from '../../src/util/formValidator';
import { getRuleValidator } from '../../src/store';
import { JsonSchema } from '../../src/models';

test('evalVisibility show valid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(evalVisibility(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalVisibility show valid case based on AndCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'bar',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'foo',
  };
  const condition: AndCondition = {
    type: 'AND',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar',
    ruleValue2: 'foo',
  };
  t.is(evalVisibility(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalVisibility show invalid case based on AndCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'bar',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'bar',
  };
  const condition: AndCondition = {
    type: 'AND',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar',
    ruleValue2: 'foo',
  };
  t.is(
    evalVisibility(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

test('evalVisibility show valid case based on OrCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'bar',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'foo',
  };
  const condition: OrCondition = {
    type: 'OR',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar1',
    ruleValue2: 'foo',
  };
  t.is(evalVisibility(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalVisibility show invalid case based on OrCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'foo',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'bar',
  };
  const condition: OrCondition = {
    type: 'OR',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar',
    ruleValue2: 'foo',
  };
  t.is(
    evalVisibility(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

test('evalVisibility show valid case based on schema condition', (t) => {
  const condition: SchemaBasedCondition = {
    scope: '#/properties/ruleValue',
    schema: {
      const: 'bar',
    },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(evalVisibility(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalVisibility show valid case based on schema condition and enum', (t) => {
  const condition: SchemaBasedCondition = {
    scope: '#/properties/ruleValue',
    schema: {
      enum: ['bar', 'baz'],
    },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(evalVisibility(uischema, data, undefined, createAjv(), undefined), true);
  t.is(
    evalVisibility(
      uischema,
      { ...data, ruleValue: 'baz' },
      undefined,
      createAjv(),
      undefined
    ),
    true
  );
  t.is(
    evalVisibility(
      uischema,
      { ...data, ruleValue: 'foo' },
      undefined,
      createAjv(),
      undefined
    ),
    false
  );
});

test('evalVisibility show invalid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.SHOW,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'foobar',
  };
  t.deepEqual(
    evalVisibility(uischema, data, undefined, createAjv(), undefined),
    false
  );
});
test('evalVisibility hide valid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.HIDE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(
    evalVisibility(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

test('evalVisibility hide invalid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.HIDE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'foobar',
  };
  t.is(evalVisibility(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalEnablement enable valid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalEnablement show valid case based on AndCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'bar',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'foo',
  };
  const condition: AndCondition = {
    type: 'AND',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar',
    ruleValue2: 'foo',
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalEnablement show invalid case based on AndCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'bar',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'bar',
  };
  const condition: AndCondition = {
    type: 'AND',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar',
    ruleValue2: 'foo',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

test('evalEnablement show valid case based on OrCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'bar',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'foo',
  };
  const condition: OrCondition = {
    type: 'OR',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar1',
    ruleValue2: 'foo',
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalEnablement show invalid case based on OrCondition', (t) => {
  const leafCondition1: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue1',
    expectedValue: 'foo',
  };
  const leafCondition2: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue2',
    expectedValue: 'bar',
  };
  const condition: OrCondition = {
    type: 'OR',
    conditions: [leafCondition1, leafCondition2],
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'hello',
    ruleValue1: 'bar',
    ruleValue2: 'foo',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

test('evalEnablement enable invalid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'foobar',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
});
test('evalEnablement disable valid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

// Add test case for ValidateFunctionCondition with evalEnablement (valid enable case)
test('evalEnablement enable valid case based on ValidateFunctionCondition', (t) => {
  const condition: ValidateFunctionCondition = {
    scope: '#/properties/ruleValue',
    validate: (context: ValidateFunctionContext) => context.data === 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), undefined), true);
});

// Add test case for ValidateFunctionCondition with evalEnablement (invalid enable case)
test('evalEnablement enable invalid case based on ValidateFunctionCondition', (t) => {
  const condition: ValidateFunctionCondition = {
    scope: '#/properties/ruleValue',
    validate: (context: ValidateFunctionContext) => context.data === 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'foobar',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

// Add test case for ValidateFunctionCondition with evalEnablement (valid disable case)
test('evalEnablement disable valid case based on ValidateFunctionCondition', (t) => {
  const condition: ValidateFunctionCondition = {
    scope: '#/properties/ruleValue',
    validate: (context: ValidateFunctionContext) => context.data === 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
});

// Add test case for ValidateFunctionCondition with evalEnablement (invalid disable case)
test('evalEnablement disable invalid case based on ValidateFunctionCondition', (t) => {
  const condition: ValidateFunctionCondition = {
    scope: '#/properties/ruleValue',
    validate: (context: ValidateFunctionContext) => context.data === 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'foobar',
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), undefined), true);
});

// Test context properties for ValidateFunctionCondition
test('ValidateFunctionCondition correctly passes context parameters', (t) => {
  const condition: ValidateFunctionCondition = {
    scope: '#/properties/ruleValue',
    validate: (context: ValidateFunctionContext) => {
      // Verify all context properties are passed correctly
      return (
        context.data === 'bar' &&
        (context.fullData as any).value === 'foo' &&
        context.path === undefined &&
        (context.uischemaElement as any).scope === '#/properties/value' &&
        typeof (context.config as any).externalValidator === 'function'
      );
    },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  const config = {
    externalValidator: (_context: ValidateFunctionContext): boolean => {
      return true;
    },
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), config), true);
});

test('evalEnablement disable invalid case', (t) => {
  const leafCondition: LeafCondition = {
    type: 'LEAF',
    scope: '#/properties/ruleValue',
    expectedValue: 'bar',
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'foobar',
  };
  t.is(evalEnablement(uischema, data, undefined, createAjv(), undefined), true);
});

test('evalEnablement disable invalid case based on schema condition', (t) => {
  const condition: SchemaBasedCondition = {
    scope: '#/properties/ruleValue',
    schema: {
      enum: ['bar', 'baz'],
    },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };
  t.is(
    evalEnablement(uischema, data, undefined, createAjv(), undefined),
    false
  );
  t.is(
    evalEnablement(
      uischema,
      { ...data, ruleValue: 'baz' },
      undefined,
      createAjv(),
      undefined
    ),
    false
  );
  t.is(
    evalEnablement(
      uischema,
      { ...data, ruleValue: 'foo' },
      undefined,
      createAjv(),
      undefined
    ),
    true
  );
});

test('evalEnablement fail on failWhenUndefined', (t) => {
  const condition: SchemaBasedCondition = {
    scope: '#/properties/ruleValue',
    schema: {
      enum: ['bar', 'baz'],
    },
  };
  const failConditionTrue: SchemaBasedCondition = {
    ...condition,
    failWhenUndefined: true,
  };
  const failConditionFalse: SchemaBasedCondition = {
    ...condition,
    failWhenUndefined: false,
  };

  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: failConditionTrue,
    },
  };
  const failConditionTrueUischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: failConditionTrue,
    },
  };
  const failConditionFalseUischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: failConditionFalse,
    },
  };
  const data = {
    value: 'foo',
  };
  t.is(
    evalEnablement(
      failConditionTrueUischema,
      data,
      undefined,
      createAjv(),
      undefined
    ),
    true
  );
  t.is(
    evalEnablement(
      failConditionFalseUischema,
      data,
      undefined,
      createAjv(),
      undefined
    ),
    evalEnablement(uischema, data, undefined, createAjv(), undefined)
  );
});

test('evalReadonly readonly valid case', (t) => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.READONLY,
      condition: {
        type: 'LEAF',
        scope: '#/properties/ruleValue',
        expectedValue: 'bar',
      },
    },
  };

  t.true(
    evalReadonly(
      uischema,
      { value: 'foo', ruleValue: 'bar' },
      undefined,
      createAjv(),
      undefined
    )
  );
});

test('evalReadonly writable valid and invalid cases', (t) => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.WRITABLE,
      condition: {
        type: 'LEAF',
        scope: '#/properties/ruleValue',
        expectedValue: 'bar',
      },
    },
  };

  t.false(
    evalReadonly(
      uischema,
      { value: 'foo', ruleValue: 'bar' },
      undefined,
      createAjv(),
      undefined
    )
  );
  t.true(
    evalReadonly(
      uischema,
      { value: 'foo', ruleValue: 'baz' },
      undefined,
      createAjv(),
      undefined
    )
  );
});

test('hasReadonlyRule detects readonly and writable rules', (t) => {
  t.true(
    hasReadonlyRule({
      type: 'Control',
      scope: '#/properties/value',
      rule: {
        effect: RuleEffect.READONLY,
        condition: {
          type: 'LEAF',
          scope: '#/properties/ruleValue',
          expectedValue: 'bar',
        },
      },
    })
  );
  t.true(
    hasReadonlyRule({
      type: 'Control',
      scope: '#/properties/value',
      rule: {
        effect: RuleEffect.WRITABLE,
        condition: {
          type: 'LEAF',
          scope: '#/properties/ruleValue',
          expectedValue: 'bar',
        },
      },
    })
  );
  t.false(
    hasReadonlyRule({
      type: 'Control',
      scope: '#/properties/value',
      rule: {
        effect: RuleEffect.ENABLE,
        condition: {
          type: 'LEAF',
          scope: '#/properties/ruleValue',
          expectedValue: 'bar',
        },
      },
    })
  );
});

test('isReadonly defaults to false without rule', (t) => {
  t.false(
    isReadonly(
      {
        type: 'Control',
        scope: '#/properties/value',
      },
      {},
      undefined,
      createAjv(),
      undefined
    )
  );
});

test('isReadonly evaluates readonly rules', (t) => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.READONLY,
      condition: {
        type: 'LEAF',
        scope: '#/properties/ruleValue',
        expectedValue: 'bar',
      },
    },
  };

  t.true(
    isReadonly(
      uischema,
      { value: 'foo', ruleValue: 'bar' },
      undefined,
      createAjv(),
      undefined
    )
  );
});

test('isInherentlyEnabled disabled globally', (t) => {
  t.false(
    isInherentlyEnabled(
      { jsonforms: { readonly: true } },
      null,
      null as any,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyEnabled ignores global readonly when separated', (t) => {
  t.true(
    isInherentlyEnabled(
      { jsonforms: { readonly: true } },
      null,
      null as any,
      undefined,
      null,
      { separateReadonlyFromDisabled: true }
    )
  );
});

test('isInherentlyEnabled disabled by ownProps', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      { enabled: false },
      null as any,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyEnabled enabled by ownProps', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      { enabled: true },
      null as any,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by uischema', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      null,
      { options: { readonly: true } } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyEnabled ignores readonly uischema when separated', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      null,
      { options: { readonly: true } } as unknown as ControlElement,
      undefined,
      null,
      { separateReadonlyFromDisabled: true }
    )
  );
});

test('isInherentlyEnabled disabled by uischema over ownProps', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      { enabled: true },
      { options: { readonly: true } } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyEnabled enabled by uischema over schema', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      null,
      { options: { readonly: false } } as unknown as ControlElement,
      { readOnly: true },
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by ownProps over schema enablement', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      { enabled: false },
      null as any,
      { readOnly: false },
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by uischema over schema', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      null,
      { options: { readonly: true } } as unknown as ControlElement,
      { readOnly: false },
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by schema', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      null,
      null as any,
      { readOnly: true },
      null,
      null
    )
  );
});

test('isInherentlyEnabled ignores readonly schema when separated', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      null,
      null as any,
      { readOnly: true },
      null,
      { separateReadonlyFromDisabled: true }
    )
  );
});

test('isInherentlyEnabled disabled by schema over ownProps', (t) => {
  t.false(
    isInherentlyEnabled(
      null as any,
      { enabled: true },
      null as any,
      { readOnly: true },
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by rule', (t) => {
  const leafCondition: SchemaBasedCondition = {
    scope: '#/properties/ruleValue',
    schema: { type: 'string', pattern: 'bar' },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.DISABLE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };

  t.false(
    isInherentlyEnabled(
      { jsonforms: { core: { ajv: createAjv() } as unknown as JsonFormsCore } },
      null,
      uischema,
      undefined,
      data,
      null
    )
  );
});

test('isInherentlyEnabled disabled by global over rule ', (t) => {
  const leafCondition: SchemaBasedCondition = {
    scope: '#/properties/ruleValue',
    schema: { type: 'string', pattern: 'bar' },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.ENABLE,
      condition: leafCondition,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };

  t.false(
    isInherentlyEnabled(
      {
        jsonforms: {
          readonly: true,
          core: { ajv: createAjv() } as unknown as JsonFormsCore,
        },
      },
      null,
      uischema,
      undefined,
      data,
      null
    )
  );
});

test('isInherentlyEnabled disabled by config', (t) => {
  t.false(
    isInherentlyEnabled(null as any, null, null as any, undefined, null, {
      readonly: true,
    })
  );
});

test('isInherentlyEnabled ignores readonly config when separated', (t) => {
  t.true(
    isInherentlyEnabled(null as any, null, null as any, undefined, null, {
      readonly: true,
      separateReadonlyFromDisabled: true,
    })
  );
});

test('isInherentlyEnabled enabled by config over ownProps', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      { enabled: false },
      null as any,
      undefined,
      null,
      {
        readonly: false,
      }
    )
  );
});

test('isInherentlyEnabled enabled by uischema over config', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      null,
      { options: { readonly: false } } as unknown as ControlElement,
      undefined,
      null,
      { readonly: true }
    )
  );
});

test('isInherentlyEnabled prefer readonly over readOnly', (t) => {
  t.true(
    isInherentlyEnabled(
      null as any,
      null,
      {
        options: { readonly: false, readOnly: true },
      } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
  t.false(
    isInherentlyEnabled(
      null as any,
      null,
      {
        options: { readonly: true, readOnly: false },
      } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyEnabled enabled', (t) => {
  t.true(
    isInherentlyEnabled(null as any, null, null as any, undefined, null, null)
  );
});

test('isInherentlyReadonly readonly globally', (t) => {
  t.true(
    isInherentlyReadonly(
      { jsonforms: { readonly: true } },
      null,
      null as any,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyReadonly readonly by uischema option', (t) => {
  t.true(
    isInherentlyReadonly(
      null as any,
      { readonly: false },
      { options: { readonly: true } } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyReadonly prefer readonly over readOnly', (t) => {
  t.false(
    isInherentlyReadonly(
      null as any,
      null,
      {
        options: { readonly: false, readOnly: true },
      } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
  t.true(
    isInherentlyReadonly(
      null as any,
      null,
      {
        options: { readonly: true, readOnly: false },
      } as unknown as ControlElement,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyReadonly readonly by schema', (t) => {
  t.true(
    isInherentlyReadonly(
      null as any,
      null,
      null as any,
      { readOnly: true },
      null,
      null
    )
  );
});

test('isInherentlyReadonly readonly by ownProps', (t) => {
  t.true(
    isInherentlyReadonly(
      null as any,
      { readonly: true },
      null as any,
      undefined,
      null,
      null
    )
  );
});

test('isInherentlyReadonly evaluates readonly and writable rules', (t) => {
  const readonlyRule: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.READONLY,
      condition: {
        type: 'LEAF',
        scope: '#/properties/ruleValue',
        expectedValue: 'bar',
      },
    },
  };
  const writableRule: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: {
      effect: RuleEffect.WRITABLE,
      condition: {
        type: 'LEAF',
        scope: '#/properties/ruleValue',
        expectedValue: 'bar',
      },
    },
  };
  const state = {
    jsonforms: {
      core: { ajv: createAjv() } as unknown as JsonFormsCore,
    },
  };
  const data = {
    value: 'foo',
    ruleValue: 'bar',
  };

  t.true(
    isInherentlyReadonly(state, null, readonlyRule, undefined, data, null)
  );
  t.false(
    isInherentlyReadonly(state, null, writableRule, undefined, data, null)
  );
  t.true(
    isInherentlyReadonly(
      state,
      null,
      writableRule,
      undefined,
      { ...data, ruleValue: 'baz' },
      null
    )
  );
});

const ruleUischema = (
  condition: SchemaBasedCondition | AndCondition | OrCondition
): ControlElement => ({
  type: 'Control',
  scope: '#/properties/value',
  rule: { effect: RuleEffect.SHOW, condition },
});

const barCondition: SchemaBasedCondition = {
  scope: '#/properties/ruleValue',
  schema: { const: 'bar' },
};

test('rules - schema condition uses the Form Validator matches when present', (t) => {
  const calls: Array<[JsonSchema, unknown]> = [];
  const validator: FormValidator = {
    validate: () => [],
    matches: (schema, data) => {
      calls.push([schema, data]);
      return data === 'bar';
    },
  };
  const uischema = ruleUischema(barCondition);
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'bar' },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalVisibility(
      uischema,
      { ruleValue: 'baz' },
      undefined,
      validator,
      undefined
    )
  );
  t.deepEqual(calls, [
    [barCondition.schema, 'bar'],
    [barCondition.schema, 'baz'],
  ]);
});

test('rules - a Form Validator without matches falls back to the Structural Matcher', (t) => {
  const validator: FormValidator = { validate: () => [] };
  const uischema = ruleUischema(barCondition);
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'bar' },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalVisibility(
      uischema,
      { ruleValue: 'baz' },
      undefined,
      validator,
      undefined
    )
  );
});

test('rules - no validator at all also evaluates value constraints', (t) => {
  const uischema = ruleUischema({
    scope: '#/properties/ruleValue',
    schema: { type: 'number', minimum: 18 },
  });
  t.true(
    evalVisibility(uischema, { ruleValue: 18 }, undefined, undefined, undefined)
  );
  t.false(
    evalVisibility(uischema, { ruleValue: 17 }, undefined, undefined, undefined)
  );
  const pattern = ruleUischema({
    scope: '#/properties/ruleValue',
    schema: { pattern: '^DE' },
  });
  t.true(
    evalVisibility(
      pattern,
      { ruleValue: 'DE123' },
      undefined,
      undefined,
      undefined
    )
  );
  t.false(
    evalVisibility(
      pattern,
      { ruleValue: 'FR123' },
      undefined,
      undefined,
      undefined
    )
  );
});

test('rules - a Form Validator without matches gets value constraints evaluated too', (t) => {
  const validator: FormValidator = { validate: () => [] };
  const uischema = ruleUischema({
    scope: '#/properties/ruleValue',
    schema: { not: { const: 'hidden' } },
  });
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'shown' },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalVisibility(
      uischema,
      { ruleValue: 'hidden' },
      undefined,
      validator,
      undefined
    )
  );
});

test('rules - no validator at all uses the Structural Matcher', (t) => {
  const uischema = ruleUischema({
    scope: '#/properties/ruleValue',
    schema: { type: 'string', enum: ['a', 'b'] },
  });
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'a' },
      undefined,
      undefined,
      undefined
    )
  );
  t.false(
    evalVisibility(
      uischema,
      { ruleValue: 'c' },
      undefined,
      undefined,
      undefined
    )
  );
  t.false(
    evalVisibility(uischema, { ruleValue: 1 }, undefined, undefined, undefined)
  );
});

test('rules - a Form Validator Factory is called once per condition schema', (t) => {
  const compiled: JsonSchema[] = [];
  const factory = (schema: JsonSchema): FormValidator => {
    compiled.push(schema);
    return {
      validate: (data) =>
        data === (schema as { const: unknown }).const
          ? []
          : [{ path: '', key: 'const', message: 'mismatch' }],
    };
  };
  const uischema = ruleUischema(barCondition);
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'bar' },
      undefined,
      factory,
      undefined
    )
  );
  t.false(
    evalVisibility(
      uischema,
      { ruleValue: 'baz' },
      undefined,
      factory,
      undefined
    )
  );
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'bar' },
      undefined,
      factory,
      undefined
    )
  );
  t.is(compiled.length, 1);
  t.is(compiled[0], barCondition.schema);

  const other = ruleUischema({
    scope: '#/properties/ruleValue',
    schema: { const: 'other' },
  });
  t.true(
    evalVisibility(other, { ruleValue: 'other' }, undefined, factory, undefined)
  );
  t.is(compiled.length, 2);
});

test('rules - AND and OR compose with a Form Validator', (t) => {
  const validator: FormValidator = {
    validate: () => [],
    matches: (schema, data) => data === (schema as { const: unknown }).const,
  };
  const and: AndCondition = {
    type: 'AND',
    conditions: [
      barCondition,
      { scope: '#/properties/other', schema: { const: 1 } },
    ],
  };
  const or: OrCondition = { type: 'OR', conditions: and.conditions };
  t.true(
    evalVisibility(
      ruleUischema(and),
      { ruleValue: 'bar', other: 1 },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalVisibility(
      ruleUischema(and),
      { ruleValue: 'bar', other: 2 },
      undefined,
      validator,
      undefined
    )
  );
  t.true(
    evalVisibility(
      ruleUischema(or),
      { ruleValue: 'x', other: 1 },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalVisibility(
      ruleUischema(or),
      { ruleValue: 'x', other: 2 },
      undefined,
      validator,
      undefined
    )
  );
});

test('rules - an AJV instance keeps working as the rule validator', (t) => {
  const uischema = ruleUischema({
    scope: '#/properties/ruleValue',
    schema: { type: 'string', minLength: 3 },
  });
  t.true(
    evalVisibility(
      uischema,
      { ruleValue: 'long' },
      undefined,
      createAjv(),
      undefined
    )
  );
  t.false(
    evalVisibility(
      uischema,
      { ruleValue: 'no' },
      undefined,
      createAjv(),
      undefined
    )
  );
});

test('rules - enablement and readonly go through the Form Validator too', (t) => {
  const validator: FormValidator = {
    validate: () => [],
    matches: (_schema, data) => data === 'bar',
  };
  const enable: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: { effect: RuleEffect.ENABLE, condition: barCondition },
  };
  const readonly: ControlElement = {
    type: 'Control',
    scope: '#/properties/value',
    rule: { effect: RuleEffect.READONLY, condition: barCondition },
  };
  t.true(
    evalEnablement(
      enable,
      { ruleValue: 'bar' },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalEnablement(enable, { ruleValue: 'x' }, undefined, validator, undefined)
  );
  t.true(
    evalReadonly(
      readonly,
      { ruleValue: 'bar' },
      undefined,
      validator,
      undefined
    )
  );
  t.false(
    evalReadonly(readonly, { ruleValue: 'x' }, undefined, validator, undefined)
  );
});

test('matchesConditionSchema - dispatches on the validator kind', (t) => {
  const schema: JsonSchema = { const: 'a' };
  t.true(matchesConditionSchema(schema, 'a', undefined));
  t.true(matchesConditionSchema(schema, 'a', createAjv()));
  t.false(matchesConditionSchema(schema, 'b', createAjv()));
  t.true(matchesConditionSchema(schema, 'a', { validate: () => [] }));
  t.false(
    matchesConditionSchema(schema, 'a', {
      validate: () => [],
      matches: () => false,
    })
  );
  t.false(
    matchesConditionSchema(schema, 'a', () => ({
      validate: () => [{ path: '', message: 'nope' }],
    }))
  );
});

test('getRuleValidator - AJV instance when no custom validator is configured', (t) => {
  const ajv = createAjv();
  const state = { jsonforms: { core: { ajv } as unknown as JsonFormsCore } };
  t.is(getRuleValidator(state as any), ajv);
  t.is(getRuleValidator({ jsonforms: {} } as any), undefined);
});

test('getRuleValidator - the bound Form Validator when a custom one is configured', (t) => {
  const ajv = createAjv();
  const bound: FormValidator = { validate: () => [] };
  const factory = () => bound;
  const state = {
    jsonforms: {
      core: {
        ajv,
        validatorOption: factory,
        formValidator: bound,
      } as unknown as JsonFormsCore,
    },
  };
  t.is(getRuleValidator(state as any), bound);
  const off = {
    jsonforms: {
      core: {
        ajv,
        validatorOption: factory,
        formValidator: undefined,
      } as unknown as JsonFormsCore,
    },
  };
  t.is(getRuleValidator(off as any), factory);
});

test('isVisible - integrates with getRuleValidator for a custom validator', (t) => {
  const bound: FormValidator = {
    validate: () => [],
    matches: (_schema, data) => data === 'bar',
  };
  const core = {
    ajv: {
      validate: () => {
        throw new Error('AJV must not evaluate rules when a validator is set');
      },
      compile: () => {
        throw new Error('no compile');
      },
    },
    validatorOption: bound,
    formValidator: bound,
  } as unknown as JsonFormsCore;
  const state = { jsonforms: { core } } as any;
  const uischema = ruleUischema(barCondition);
  t.true(
    isVisible(
      uischema,
      { ruleValue: 'bar' },
      undefined,
      getRuleValidator(state),
      undefined
    )
  );
  t.false(
    isVisible(
      uischema,
      { ruleValue: 'x' },
      undefined,
      getRuleValidator(state),
      undefined
    )
  );
});

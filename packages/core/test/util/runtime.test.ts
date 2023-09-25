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
  isInherentlyEnabled,
  JsonFormsCore,
  LeafCondition,
  OrCondition,
  RuleEffect,
  SchemaBasedCondition,
} from '../../src';
import { evalEnablement, evalVisibility } from '../../src/util/runtime';

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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), true);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), true);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), false);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), true);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), false);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), true);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), true);
  t.is(
    evalVisibility(
      uischema,
      { ...data, ruleValue: 'baz' },
      undefined,
      createAjv()
    ),
    true
  );
  t.is(
    evalVisibility(
      uischema,
      { ...data, ruleValue: 'foo' },
      undefined,
      createAjv()
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
  t.deepEqual(evalVisibility(uischema, data, undefined, createAjv()), false);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), false);
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
  t.is(evalVisibility(uischema, data, undefined, createAjv()), true);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), true);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), true);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), false);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), true);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), false);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), false);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), false);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), true);
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
  t.is(evalEnablement(uischema, data, undefined, createAjv()), false);
  t.is(
    evalEnablement(
      uischema,
      { ...data, ruleValue: 'baz' },
      undefined,
      createAjv()
    ),
    false
  );
  t.is(
    evalEnablement(
      uischema,
      { ...data, ruleValue: 'foo' },
      undefined,
      createAjv()
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
    evalEnablement(failConditionTrueUischema, data, undefined, createAjv()),
    true
  );
  t.is(
    evalEnablement(failConditionFalseUischema, data, undefined, createAjv()),
    evalEnablement(uischema, data, undefined, createAjv())
  );
});

test('isInherentlyEnabled disabled globally', (t) => {
  t.false(
    isInherentlyEnabled(
      { jsonforms: { readonly: true } },
      null,
      null,
      null,
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by ownProps', (t) => {
  t.false(
    isInherentlyEnabled(null, { enabled: false }, null, null, null, null)
  );
});

test('isInherentlyEnabled enabled by ownProps', (t) => {
  t.true(isInherentlyEnabled(null, { enabled: true }, null, null, null, null));
});

test('isInherentlyEnabled disabled by uischema', (t) => {
  t.false(
    isInherentlyEnabled(
      null,
      null,
      { options: { readonly: true } } as unknown as ControlElement,
      null,
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by uischema over ownProps', (t) => {
  t.false(
    isInherentlyEnabled(
      null,
      { enabled: true },
      { options: { readonly: true } } as unknown as ControlElement,
      null,
      null,
      null
    )
  );
});

test('isInherentlyEnabled enabled by uischema over schema', (t) => {
  t.true(
    isInherentlyEnabled(
      null,
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
      null,
      { enabled: false },
      null,
      { readOnly: false },
      null,
      null
    )
  );
});

test('isInherentlyEnabled disabled by uischema over schema', (t) => {
  t.false(
    isInherentlyEnabled(
      null,
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
    isInherentlyEnabled(null, null, null, { readOnly: true }, null, null)
  );
});

test('isInherentlyEnabled disabled by schema over ownProps', (t) => {
  t.false(
    isInherentlyEnabled(
      null,
      { enabled: true },
      null,
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
      { jsonforms: { core: { ajv: createAjv() } as JsonFormsCore } },
      null,
      uischema,
      null,
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
          core: { ajv: createAjv() } as JsonFormsCore,
        },
      },
      null,
      uischema,
      null,
      data,
      null
    )
  );
});

test('isInherentlyEnabled disabled by config', (t) => {
  t.false(
    isInherentlyEnabled(null, null, null, null, null, { readonly: true })
  );
});

test('isInherentlyEnabled enabled by config over ownProps', (t) => {
  t.true(
    isInherentlyEnabled(null, { enabled: false }, null, null, null, {
      readonly: false,
    })
  );
});

test('isInherentlyEnabled enabled by uischema over config', (t) => {
  t.true(
    isInherentlyEnabled(
      null,
      null,
      { options: { readonly: false } } as unknown as ControlElement,
      null,
      null,
      { readonly: true }
    )
  );
});

test('isInherentlyEnabled prefer readonly over readOnly', (t) => {
  t.true(
    isInherentlyEnabled(
      null,
      null,
      {
        options: { readonly: false, readOnly: true },
      } as unknown as ControlElement,
      null,
      null,
      null
    )
  );
  t.false(
    isInherentlyEnabled(
      null,
      null,
      {
        options: { readonly: true, readOnly: false },
      } as unknown as ControlElement,
      null,
      null,
      null
    )
  );
});

test('isInherentlyEnabled enabled', (t) => {
  t.true(isInherentlyEnabled(null, null, null, null, null, null));
});

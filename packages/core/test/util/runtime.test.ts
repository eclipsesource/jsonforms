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
import { ControlElement, LeafCondition, RuleEffect } from '../../src';
import { evalEnablement, evalVisibility } from '../../src/util/runtime';

test('evalVisibility show valid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.SHOW,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'bar'
    };
    t.is(evalVisibility(uischema, data), true);
});

test('evalVisibility show invalid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.SHOW,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'foobar'
    };
    t.deepEqual(evalVisibility(uischema, data), false);
});
test('evalVisibility hide valid case', t => {
    const leafCondition: LeafCondition = {
        'type': 'LEAF' ,
        'scope': '#/properties/ruleValue',
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': '#/properties/value',
        'rule': {
            'effect': RuleEffect.HIDE,
            'condition': leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'bar'
    };
    t.is(evalVisibility(uischema, data), false);
});

test('evalVisibility hide invalid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.HIDE,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'foobar'
    };
    t.is(evalVisibility(uischema, data), true);
});

test('evalEnablement enable valid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.ENABLE,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'bar'
    };
    t.is(evalEnablement(uischema, data), true);
});

test('evalEnablement enable invalid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.ENABLE,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'foobar'
    };
    t.is(evalEnablement(uischema, data), false);
});
test('evalEnablement disable valid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.DISABLE,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'bar'
    };
    t.is(evalEnablement(uischema, data), false);
});

test('evalEnablement disable invalid case', t => {
    const leafCondition: LeafCondition = {
        type: 'LEAF' ,
        scope: '#/properties/ruleValue',
        expectedValue: 'bar'
      };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/value',
        rule: {
            effect: RuleEffect.DISABLE,
            condition: leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'foobar'
    };
    t.is(evalEnablement(uischema, data), true);
});

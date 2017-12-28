import test from 'ava';
import { ControlElement, LeafCondition, RuleEffect } from '../src/models/uischema';

import { evalEnablement, evalVisibility } from '../src/helpers/runtime';

test('evalVisibility show valid case', t => {
    const leafCondition: LeafCondition = {
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.SHOW,
            'condition': leafCondition
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
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.SHOW,
            'condition': leafCondition
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
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
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
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.HIDE,
            'condition': leafCondition
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
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.ENABLE,
            'condition': leafCondition
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
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.ENABLE,
            'condition': leafCondition
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
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.DISABLE,
            'condition': leafCondition
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
        'type': 'LEAF' ,
        'scope': {
          '$ref': '#/properties/ruleValue'
        },
        'expectedValue': 'bar'
      };
    const uischema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/value'
        },
        'rule': {
            'effect': RuleEffect.DISABLE,
            'condition': leafCondition
        }
    };
    const data = {
        value: 'foo',
        ruleValue: 'foobar'
    };
    t.is(evalEnablement(uischema, data), true);
});

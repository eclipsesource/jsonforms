"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const testers_1 = require("../src/core/testers");
ava_1.default('schemaTypeIs should check type sub-schema of control', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.true(testers_1.schemaTypeIs('string')(uischema, schema));
    t.false(testers_1.schemaTypeIs('integer')(uischema, schema));
});
ava_1.default('schemaTypeIs should return false for non-control UI schema elements', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const label = {
        type: 'Label',
        text: 'some text'
    };
    t.false(testers_1.schemaTypeIs('integer')(label, schema));
});
ava_1.default('schemaTypeIs should return false for control pointing to invalid sub-schema', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    t.false(testers_1.schemaTypeIs('string')(uischema, schema));
});
ava_1.default('formatIs should check the format of a resolved sub-schema', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                format: 'date-time'
            }
        }
    };
    t.true(testers_1.formatIs('date-time')(uischema, schema));
});
ava_1.default('uiTypeIs', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.true(testers_1.uiTypeIs('Control')(control, undefined));
});
ava_1.default('optionIs should check for options', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        },
        options: {
            answer: 42
        }
    };
    t.true(testers_1.optionIs('answer', 42)(control, undefined));
});
ava_1.default('optionIs should return false for UI schema elements without options field', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.false(testers_1.optionIs('answer', 42)(control, undefined));
});
ava_1.default('schemaMatches should check type sub-schema of control via predicate', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.true(testers_1.schemaMatches(subSchema => subSchema.type === 'string')(uischema, schema));
});
ava_1.default('schemaMatches should return false for non-control UI schema elements', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const label = {
        type: 'Label',
        text: 'some text'
    };
    t.false(testers_1.schemaMatches(subSchema => false)(label, schema));
});
ava_1.default('schemaMatches should return false for control pointing to invalid subschema', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.false(testers_1.schemaMatches(subSchema => false)(uischema, schema));
});
ava_1.default('refEndsWith checks whether the ref of a control ends with a certain string', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.true(testers_1.refEndsWith('properties/bar')(uischema, undefined));
});
ava_1.default('refEndsWith should return false for non-control UI schema elements', t => {
    const label = {
        type: 'Label',
        text: 'some text'
    };
    t.false(testers_1.refEndsWith('properties/bar')(label, undefined));
});
ava_1.default('refEndIs checks whether the last segment a control ref equals a certain string', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.true(testers_1.refEndIs('bar')(uischema, undefined));
});
ava_1.default('refEndIs should return false for non-control UI schema elements', t => {
    const label = {
        type: 'Label',
        text: 'some text'
    };
    t.false(testers_1.refEndIs('bar')(label, undefined));
});
ava_1.default('and should allow to compose multiple testers', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.true(testers_1.and(testers_1.schemaTypeIs('string'), testers_1.refEndIs('foo'))(uischema, schema));
});
//# sourceMappingURL=testers.test.js.map
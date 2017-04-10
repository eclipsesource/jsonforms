import test from 'ava';
import {
    and,
    formatIs,
    optionIs,
    refEndIs,
    refEndsWith,
    schemaMatches,
    schemaTypeIs,
    uiTypeIs
} from '../src/core/testers';
import {JsonSchema} from '../src/models/jsonSchema';
import {ControlElement, LabelElement} from '../src/models/uischema';

test('schemaTypeIs should check type sub-schema of control', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.true(schemaTypeIs('string')(uiSchema, schema));
    t.false(schemaTypeIs('integer')(uiSchema, schema));
});

test('schemaTypeIs should return false for non-control UI schema elements', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const label: LabelElement = {
        type: 'Label',
        text: 'some text'
    };
    t.false(schemaTypeIs('integer')(label, schema));
});

test('schemaTypeIs should return false for control pointing to invalid sub-schema', t => {
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    t.false(schemaTypeIs('string')(uiSchema, schema));
});

test('formatIs should check the format of a resolved sub-schema', t => {
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                format: 'date-time'
            }
        }
    };
    t.true(formatIs('date-time')(uiSchema, schema));
});

test('uiTypeIs', t => {
    const control: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.true(uiTypeIs('Control')(control, undefined));
});

test('optionIs should check for options', t => {
    const control: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        },
        options: {
            answer: 42
        }
    };
    t.true(optionIs('answer', 42)(control, undefined))
});

test('optionIs should return false for UI schema elements without options field', t => {
    const control: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.false(optionIs('answer', 42)(control, undefined));
});

test('schemaMatches should check type sub-schema of control via predicate', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.true(schemaMatches(subSchema => subSchema.type === 'string')(uiSchema, schema));
});


test('schemaMatches should return false for non-control UI schema elements', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const label: LabelElement = {
        type: 'Label',
        text: 'some text'
    };
    t.false(schemaMatches(subSchema => false)(label, schema));
});

test('schemaMatches should return false for control pointing to invalid subschema', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.false(schemaMatches(subSchema => false)(uiSchema, schema));
});

test('refEndsWith checks whether the ref of a control ends with a certain string', t => {
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.true(refEndsWith('properties/bar')(uiSchema, undefined))
});

test('refEndsWith should return false for non-control UI schema elements', t => {
    const label: LabelElement = {
        type: 'Label',
        text: 'some text'
    };
    t.false(refEndsWith('properties/bar')(label, undefined))
});

test('refEndIs checks whether the last segment a control ref equals a certain string', t => {
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bar'
        }
    };
    t.true(refEndIs('bar')(uiSchema, undefined))
});

test('refEndIs should return false for non-control UI schema elements', t => {
    const label: LabelElement = {
        type: 'Label',
        text: 'some text'
    };
    t.false(refEndIs('bar')(label, undefined))
});

test('and should allow to compose multiple testers', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: { type: 'string' }
        }
    };
    const uiSchema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.true(and(
        schemaTypeIs('string'),
        refEndIs('foo')
    )(uiSchema, schema));
});


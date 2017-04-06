import {test} from 'ava';
import { JsonSchema } from '../src/models/jsonSchema';
import { generateDefaultUISchema } from '../src/generators/ui-schema-gen';
import { Layout, ControlElement } from '../src/models/uischema';
import {UiSchemaRegistry, UiSchemaRegistryImpl} from '../src/core/uischema.registry';

test('UiSchemaRegistry returns GeneratedUiSchema', t => {
    const registry: UiSchemaRegistry = new UiSchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const bestUiSchema = registry.getBestUiSchema(schema, {name: 'John Doe'});
    t.deepEqual(bestUiSchema, generateDefaultUISchema(schema));
});
test('UiSchemaRegistry returns registered', t => {
    const registry: UiSchemaRegistry = new UiSchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uischema = {type: 'Group', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    registry.register(uischema, () =>  5);
    const bestUiSchema = registry.getBestUiSchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uischema);
});
test('UiSchemaRegistry returns generated if unregistered', t => {
    const registry: UiSchemaRegistry = new UiSchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uischema = {type: 'Group', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const tester = () =>  5;
    registry.register(uischema, tester);
    registry.unregister(uischema, tester);
    const bestUiSchema = registry.getBestUiSchema(schema, {name: 'John Doe'});
    t.deepEqual(bestUiSchema, generateDefaultUISchema(schema));
});
test('UiSchemaRegistry returns highest Fitting', t => {
    const registry: UiSchemaRegistry = new UiSchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uischema1 = {type: 'HorizontalLayout', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const uischema2 = {type: 'Group', label: 'My Group', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    registry.register(uischema2, (test_schema) =>  test_schema === schema ? 10 : -1);
    registry.register(uischema1, (test_schema) =>  test_schema === schema ? 5 : -1);
    const bestUiSchema = registry.getBestUiSchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uischema2);
});
test('UiSchemaRegistry returns best fit after unregistering an element', t => {
    const registry: UiSchemaRegistry = new UiSchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uischema1 = {type: 'HorizontalLayout', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const uischema2 = {type: 'Group', label: 'My Group', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const uischema3 = {type: 'VertialLayout', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const tester1 = (test_schema) =>  test_schema === schema ? 1 : -1;
    const tester2 = (test_schema) =>  test_schema === schema ? 3 : -1;
    const tester3 = (test_schema) =>  test_schema === schema ? 2 : -1;
    registry.register(uischema1, tester1);
    registry.register(uischema2, tester2);
    registry.register(uischema3, tester3);
    registry.unregister(uischema2, tester2);
    // tester3 should be triggered
    const bestUiSchema = registry.getBestUiSchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uischema3);
});
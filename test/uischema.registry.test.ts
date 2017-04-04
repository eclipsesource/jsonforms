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
    const testFunction = () =>  5;
    registry.register(uischema, testFunction);
    registry.unregister(uischema, testFunction);
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

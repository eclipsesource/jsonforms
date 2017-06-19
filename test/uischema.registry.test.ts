import {test} from 'ava';
import { JsonSchema } from '../src/models/jsonSchema';
import { generateDefaultUISchema } from '../src/generators/ui-schema-gen';
import { Layout, ControlElement } from '../src/models/uischema';
import {UISchemaRegistry, UISchemaRegistryImpl} from '../src/core/uischema.registry';

test('UI schema registry generates default UI schema', t => {
    const registry: UISchemaRegistry = new UISchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.deepEqual(bestUiSchema, generateDefaultUISchema(schema));
});
test('UI schema registry returns registered UI schema', t => {
    const registry: UISchemaRegistry = new UISchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema = {type: 'Group', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    registry.register(uiSchema, () =>  5);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uiSchema);
});
test('UI schema registry generates UI schema if applicable UI schema has been de-registered', t => {
    const registry: UISchemaRegistry = new UISchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema = {type: 'Group', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const tester = () =>  5;
    registry.register(uiSchema, tester);
    registry.deregister(uiSchema, tester);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.deepEqual(bestUiSchema, generateDefaultUISchema(schema));
});
test('UI schema registry returns most applicable UI schema', t => {
    const registry: UISchemaRegistry = new UISchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema1 = {type: 'HorizontalLayout', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const uiSchema2 = {type: 'Group', label: 'My Group', elements: [
      {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    registry.register(uiSchema2, (test_schema) =>  test_schema === schema ? 10 : -1);
    registry.register(uiSchema1, (test_schema) =>  test_schema === schema ? 5 : -1);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uiSchema2);
});
test('UI schema registry returns most applicable UI schema after de-registering UI schema', t => {
    const registry: UISchemaRegistry = new UISchemaRegistryImpl();
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema1 = {type: 'HorizontalLayout', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const uiSchema2 = {type: 'Group', label: 'My Group', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const uiSchema3 = {type: 'VerticalLayout', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}, label: 'My Name'} as ControlElement
    ]} as Layout;
    const tester1 = (test_schema) =>  test_schema === schema ? 1 : -1;
    const tester2 = (test_schema) =>  test_schema === schema ? 3 : -1;
    const tester3 = (test_schema) =>  test_schema === schema ? 2 : -1;
    registry.register(uiSchema1, tester1);
    registry.register(uiSchema2, tester2);
    registry.register(uiSchema3, tester3);
    registry.deregister(uiSchema2, tester2);
    // tester3 should be triggered
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uiSchema3);
});

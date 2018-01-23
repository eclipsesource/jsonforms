import { test } from 'ava';
import { UISchemaRegistry, UISchemaRegistryImpl } from '../src/legacy/uischema.registry';
import { generateDefaultUISchema } from '../src/generators/ui-schema-gen';
import { JsonSchema } from '../src/models/jsonSchema';
import { ControlElement, GroupLayout, Layout, VerticalLayout } from '../src/models/uischema';

const nameControl: ControlElement =  {
    type: 'Control',
    scope: '#/properties/name',
    label: 'My Name'
};

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
    const uischema: Layout = {
        type: 'Group',
        elements: [nameControl]
    };
    registry.register(uischema, () =>  5);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, uischema);
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
    const groupLayout: GroupLayout = {
        type: 'Group',
        label: 'My Group',
        elements: [nameControl]
    };
    const tester = () =>  5;
    registry.register(groupLayout, tester);
    registry.deregister(groupLayout, tester);
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
    const horizontalLayout: Layout = {
        type: 'HorizontalLayout',
        elements: [nameControl]
    };
    const groupLayout: GroupLayout = {
        type: 'Group',
        label: 'My Group',
        elements: [nameControl]
    };
    registry.register(groupLayout, testSchema =>  testSchema === schema ? 10 : -1);
    registry.register(horizontalLayout, testSchema =>  testSchema === schema ? 5 : -1);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, groupLayout);
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
    const horizontalLayout: Layout = {
        type: 'HorizontalLayout',
        elements: [nameControl]
    };
    const groupLayout: GroupLayout = {
        type: 'Group',
        label: 'My Group',
        elements: [nameControl]
    };
    const verticalLayout: VerticalLayout = {
        type: 'VerticalLayout',
        elements: [nameControl]
    };
    const tester1 = testSchema =>  testSchema === schema ? 1 : -1;
    const tester2 = testSchema =>  testSchema === schema ? 3 : -1;
    const tester3 = testSchema =>  testSchema === schema ? 2 : -1;
    registry.register(horizontalLayout, tester1);
    registry.register(groupLayout, tester2);
    registry.register(verticalLayout, tester3);
    registry.deregister(groupLayout, tester2);
    // tester3 should be triggered
    const bestUiSchema = registry.findMostApplicableUISchema(schema, {name: 'John Doe'});
    t.is(bestUiSchema, verticalLayout);
});

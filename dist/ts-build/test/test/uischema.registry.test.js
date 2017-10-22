"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const uischema_registry_1 = require("../src/core/uischema.registry");
const ui_schema_gen_1 = require("../src/generators/ui-schema-gen");
const nameControl = {
    type: 'Control',
    scope: {
        $ref: '#/properties/name'
    },
    label: 'My Name'
};
ava_1.test('UI schema registry generates default UI schema', t => {
    const registry = new uischema_registry_1.UISchemaRegistryImpl();
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const bestUiSchema = registry.findMostApplicableUISchema(schema, { name: 'John Doe' });
    t.deepEqual(bestUiSchema, ui_schema_gen_1.generateDefaultUISchema(schema));
});
ava_1.test('UI schema registry returns registered UI schema', t => {
    const registry = new uischema_registry_1.UISchemaRegistryImpl();
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uischema = {
        type: 'Group',
        elements: [nameControl]
    };
    registry.register(uischema, () => 5);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, { name: 'John Doe' });
    t.is(bestUiSchema, uischema);
});
ava_1.test('UI schema registry generates UI schema if applicable UI schema has been de-registered', t => {
    const registry = new uischema_registry_1.UISchemaRegistryImpl();
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const groupLayout = {
        type: 'Group',
        label: 'My Group',
        elements: [nameControl]
    };
    const tester = () => 5;
    registry.register(groupLayout, tester);
    registry.deregister(groupLayout, tester);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, { name: 'John Doe' });
    t.deepEqual(bestUiSchema, ui_schema_gen_1.generateDefaultUISchema(schema));
});
ava_1.test('UI schema registry returns most applicable UI schema', t => {
    const registry = new uischema_registry_1.UISchemaRegistryImpl();
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const horizontalLayout = {
        type: 'HorizontalLayout',
        elements: [nameControl]
    };
    const groupLayout = {
        type: 'Group',
        label: 'My Group',
        elements: [nameControl]
    };
    registry.register(groupLayout, testSchema => testSchema === schema ? 10 : -1);
    registry.register(horizontalLayout, testSchema => testSchema === schema ? 5 : -1);
    const bestUiSchema = registry.findMostApplicableUISchema(schema, { name: 'John Doe' });
    t.is(bestUiSchema, groupLayout);
});
ava_1.test('UI schema registry returns most applicable UI schema after de-registering UI schema', t => {
    const registry = new uischema_registry_1.UISchemaRegistryImpl();
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const horizontalLayout = {
        type: 'HorizontalLayout',
        elements: [nameControl]
    };
    const groupLayout = {
        type: 'Group',
        label: 'My Group',
        elements: [nameControl]
    };
    const verticalLayout = {
        type: 'VerticalLayout',
        elements: [nameControl]
    };
    const tester1 = testSchema => testSchema === schema ? 1 : -1;
    const tester2 = testSchema => testSchema === schema ? 3 : -1;
    const tester3 = testSchema => testSchema === schema ? 2 : -1;
    registry.register(horizontalLayout, tester1);
    registry.register(groupLayout, tester2);
    registry.register(verticalLayout, tester3);
    registry.deregister(groupLayout, tester2);
    // tester3 should be triggered
    const bestUiSchema = registry.findMostApplicableUISchema(schema, { name: 'John Doe' });
    t.is(bestUiSchema, verticalLayout);
});
//# sourceMappingURL=uischema.registry.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const styling_registry_1 = require("../src/core/styling.registry");
ava_1.test('Styling registry allows to register a style', t => {
    const stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    stylingRegistry.register({ name: 'button', classNames: ['btn', 'btn-primary'] });
    t.deepEqual(stylingRegistry.get('button'), ['btn', 'btn-primary']);
});
ava_1.test('Styling registry allows to register a style by specifying name and classNames', t => {
    const stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    stylingRegistry.register('button', ['btn', 'btn-primary']);
    t.deepEqual(stylingRegistry.get('button'), ['btn', 'btn-primary']);
});
ava_1.test('Styling registry allows multiple classNames to be registered at once', t => {
    const stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    stylingRegistry.registerMany([
        {
            name: 'button',
            classNames: ['btn', 'btn-primary']
        },
        {
            name: 'select',
            classNames: ['custom-select']
        }
    ]);
    t.deepEqual(stylingRegistry.get('button'), ['btn', 'btn-primary']);
    t.deepEqual(stylingRegistry.get('select'), ['custom-select']);
});
ava_1.test('Styling registry allows a style to be de-registered', t => {
    const stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    stylingRegistry.register('button', ['btn', 'btn-primary']);
    stylingRegistry.deregister('button');
    t.deepEqual(stylingRegistry.get('button'), []);
});
ava_1.test('Styling registry should return classNames as concatenated string', t => {
    const stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    stylingRegistry.register('button', ['btn', 'btn-primary']);
    t.is(stylingRegistry.getAsClassName('button'), 'btn btn-primary');
    t.is(stylingRegistry.getAsClassName('something'), '');
});
ava_1.test('Styling registry should overwrite any existing style', t => {
    const stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    stylingRegistry.register('button', ['btn', 'btn-primary']);
    stylingRegistry.register('button', ['something-else']);
    t.is(stylingRegistry.getAsClassName('button'), 'something-else');
});
//# sourceMappingURL=styling.registry.test.js.map
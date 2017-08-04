import './helpers/setup';
import { test } from 'ava';
import { StylingRegistryImpl } from '../src/core/styling.registry';

test('Styling registry allows to register a style', t => {
  const stylingRegistry = new StylingRegistryImpl();
  stylingRegistry.register({name: 'button', classNames: ['btn', 'btn-primary']});
  t.deepEqual(stylingRegistry.get('button'), ['btn', 'btn-primary']);
});

test('Styling registry allows to register a style by specifying name and classNames', t => {
  const stylingRegistry = new StylingRegistryImpl();
  stylingRegistry.register('button', ['btn', 'btn-primary']);
  t.deepEqual(stylingRegistry.get('button'), ['btn', 'btn-primary']);
});

test('Styling registry allows multiple classNames to be registered at once', t => {
  const stylingRegistry = new StylingRegistryImpl();
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

test('Styling registry allows a style to be de-registered', t => {
  const stylingRegistry = new StylingRegistryImpl();
  stylingRegistry.register('button', ['btn', 'btn-primary']);
  stylingRegistry.deregister('button');
  t.deepEqual(stylingRegistry.get('button'), []);
});

test('Styling registry should apply classNames to a given element', t => {
  const button = document.createElement('button');
  const stylingRegistry = new StylingRegistryImpl();
  stylingRegistry.register('button', ['btn', 'btn-primary']);
  stylingRegistry.addStyle(button, 'button');
  t.is(button.classList.length, 2);
  t.true(button.classList.contains('btn'));
  t.true(button.classList.contains('btn-primary'));
});

test('Styling registry should overwrite any existing style', t => {
  const button = document.createElement('button');
  const stylingRegistry = new StylingRegistryImpl();
  stylingRegistry.register('button', ['btn', 'btn-primary']);
  stylingRegistry.addStyle(button, 'button');
  // reset style
  button.classList.remove('btn');
  button.classList.remove('btn-primary');
  stylingRegistry.register('button', ['something-else']);
  stylingRegistry.addStyle(button, 'button');
  // t.true(false);
  t.is(button.classList.length, 1);
});

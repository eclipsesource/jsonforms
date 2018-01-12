import { test } from 'ava';
import { findStyle, findStyleAsClassName, stylingReducer } from '../src/reducers/styling';
import { registerStyle, registerStyles, unregisterStyle } from '../src/actions';

test('register single style', t => {
    const after = stylingReducer(
      [],
      registerStyle('button', ['btn', 'btn-primary'])
    );
    t.deepEqual(findStyle(after)('button'), ['btn', 'btn-primary']);
});

test('register styles', t => {
    const after = stylingReducer(
      [],
      registerStyles(
        [
          {
            name: 'button',
            classNames: ['btn', 'btn-primary']
          },
          {
            name: 'select',
            classNames: ['custom-select']
          }
        ]
      )
    );
    t.deepEqual(findStyle(after)('button'), ['btn', 'btn-primary']);
    t.deepEqual(findStyle(after)('select'), ['custom-select']);
});

test('unregister style', t => {
  const after = stylingReducer(
    [
      { name: 'button', classNames: [ 'btn', 'btn-primary' ] },
      { name: 'select', classNames: [ 'custom-select' ] }
    ],
    unregisterStyle('button')
  );
  t.is(after.length, 1);
});

test('return classNames as concatenated string', t => {
  const after = stylingReducer(
    [],
    registerStyle('button', ['btn', 'btn-primary'])
  );

  t.is(findStyleAsClassName(after)('button'), 'btn btn-primary');
  t.is(findStyleAsClassName(after)('something'), '');
});

test('overwrite any existing style', t => {
  const after = stylingReducer(
    [],
    registerStyle('button', ['btn', 'btn-primary'])
  );
  t.is(
    findStyleAsClassName(
      stylingReducer(
        after,
        registerStyle('button', ['something-else'])
      )
    )('button'),
    'something-else'
  );
});

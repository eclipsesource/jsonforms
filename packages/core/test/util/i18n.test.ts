import test from 'ava';

import { translate } from '../../src/util';

test('text translation, with translation object', t => {
  const translationObject = {
    'foo': 'Foo'
  };
  const translatedText = translate(translationObject, '%foo');
  t.is(translatedText, 'Foo');
});

test('text translation, without translation object', t => {
  const translatedText = translate(undefined, '%foo');
  t.is(translatedText, '%foo');
});

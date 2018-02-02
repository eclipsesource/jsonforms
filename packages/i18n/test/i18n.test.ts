import test from 'ava';
import { translateLabel } from '../src';

test('text translation, with translation object', t => {
  const translationObject = {
    'foo': 'Foo'
  };
  const translatedText = translateLabel(translationObject, '%foo');
  t.is(translatedText, 'Foo');
});

test('text translation, without translation object', t => {
  const translatedText = translateLabel(undefined, '%foo');
  t.is(translatedText, '%foo');
});

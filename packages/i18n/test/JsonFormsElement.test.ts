/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import '@jsonforms/test';
import test from 'ava';
import { JsonFormsElement } from '@jsonforms/webcomponent';
import { FakeLayout, fakeLayoutTester } from '@jsonforms/test';
import { combineReducers, createStore } from 'redux';
import { jsonformsReducer, JsonFormsState } from '@jsonforms/core';
import { i18nReducer } from '../src/reducers';

test.beforeEach(t => {
  t.context.data = { name: 'foo' };
  t.context.schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/name'
  };
  t.context.translations = {
    'en-US': {
      name: 'foo'
    },
    'de-DE': {
      name: 'bar'
    }
  };
  t.context.locale = 'de-DE';
});

test.cb('render with data and translation object', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer({ i18n: i18nReducer }) }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
          schema: t.context.schema
        },
        i18n: {
          translations: t.context.translations,
          locale: t.context.locale
        },
        renderers: [{ tester: fakeLayoutTester, renderer: FakeLayout }]
      }
    }
  );

  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'layout');
      t.deepEqual(jsonForms.store.getState().jsonforms.i18n.translations, t.context.translations);
      t.is(jsonForms.store.getState().jsonforms.i18n.locale, t.context.locale);
      t.end();
    },
    100
  );
});

test.cb('render with data,translation object and locale value', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer({ i18n: i18nReducer }) }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
        },
        i18n: {
          translations: t.context.translations,
          locale: t.context.locale
        },
        renderers: [{ tester: fakeLayoutTester, renderer: FakeLayout }]
      }
    }
  );

  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'layout');
      t.deepEqual(jsonForms.store.getState().jsonforms.i18n.translations, t.context.translations);
      t.is(jsonForms.store.getState().jsonforms.i18n.locale, t.context.locale);
      t.end();
    },
    100
  );
});

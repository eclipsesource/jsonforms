import test from 'ava';
import { fromNumber } from '../src';

test.beforeEach(t => {
  t.context.data =  { 'money': '123456' };
  t.context.schema = {
    type: 'object',
    properties: {
      money: { type: 'string'}
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/money',
    options: {
      format: true
    }
  };
  t.context.styles = [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ];
  t.context.locale = 'en-US';
  t.context.numberSeparators = {
    'en-US': {
      decimalSeparator: '.',
      thousandsSeparator: ','
    }
  };
});

test('render', t => {
  const formatted = fromNumber('en-US')(123456);
  t.is(formatted, '123,456');
});

import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import {DataService } from '../../src/core/data.service';
import {ControlElement} from '../../src/models/uischema';
import {EnumControl, enumControlTester} from '../../src/renderers/controls/enum.control';
import {
  testDisable,
  testEnable, testHide,
  testMultipleErrors,
  testNotifyAboutEnablementWhenDisconnected,
  testNotifyAboutValidationWhenDisconnected,
  testNotifyAboutVisibiltyWhenDisconnected,
  testNullErrors,
  testOneError,
  testResetErrors,
  testShow,
  testUndefinedErrors
} from './base.control.tests';

test.beforeEach(t => {
  t.context.data = { 'foo': 'a' };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        enum: ['a', 'b'],
      },
    },
  };
  t.context.uiSchema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
  };
});

test('EnumControlTester', t => {
  t.is(enumControlTester(undefined, undefined), -1);
  t.is(enumControlTester(null, undefined), -1);
  t.is(enumControlTester({type: 'Foo'}, undefined), -1);
  t.is(enumControlTester({type: 'Control'}, undefined), -1);
});

test('EnumControl tester with wrong prop type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      enumControlTester(
          control,
          {type: 'object', properties: {foo: {type: 'string'}}}
      ),
      -1
  );
});

test('EnumControl tester with wrong prop type, but sibling has correct one', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      enumControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              },
              bar: {
                type: 'string',
                enum: ['a', 'b']
              }
            }
          }
      ),
      -1
  );
});

test('EnumControl tester with matching string type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      enumControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
                enum: ['a', 'b']
              }
            }
          }
      ),
      2
  );
});

test('EnumControl tester with matching numeric type', t => {
  const control: ControlElement = {
    type: 'Control',
        scope: {
      $ref: '#/properties/foo'
    }
  };
  // TODO should this be true?
  t.is(
      enumControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number',
                enum: [1, 2]
              }
            }
          }
          ),
      2
  );
});

test('EnumControl static', t => {
  const renderer: EnumControl = new EnumControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  t.is(result.className, 'control');
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Foo');
  const input = result.children[1] as HTMLSelectElement;
  t.is(input.tagName, 'SELECT');
  t.is(input.value, 'a');
  t.is(input.options.length, 2);
  t.is(input.options.item(0).value, 'a');
  t.is(input.options.item(1).value, 'b');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('EnumControl static no label', t => {
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'b'};
  const uiSchema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: false
  };
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.className, 'control');
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = result.children[1] as HTMLSelectElement;
  t.is(input.tagName, 'SELECT');
  t.is(input.value, 'b');
  t.is(input.options.length, 2);
  t.is(input.options.item(0).value, 'a');
  t.is(input.options.item(1).value, 'b');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('EnumControl inputChange', t => {
  const renderer: EnumControl = new EnumControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLSelectElement;
  input.value = 'b';
  input.onchange(null);
  t.is(t.context.data.foo, 'b');
});

test('EnumControl dataService notification', t => {
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  t.is(input.selectedIndex, 1);
  t.is(input.value, 'b');
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'a');
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});

test.failing('EnumControl dataService notification value undefined', t => {
  const renderer: EnumControl = new EnumControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  dataService.notifyAboutDataChange(
      {
        type: 'Control',
        scope: {
          $ref: '#/properties/foo',
        },
      },
      undefined,
  );
  t.is(input.selectedIndex, -1);
});

test.failing('EnumControl dataService notification value null', t => {
  const renderer: EnumControl = new EnumControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.selectedIndex, -1);
});
test('EnumControl dataService notification wrong ref', t => {
  const renderer: EnumControl = new EnumControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  dataService.notifyAboutDataChange(
      {
        type: 'Control',
        scope: {
          $ref: '#/properties/bar',
        },
      },
      'Bar',
  );
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});

test('EnumControl dataService notification null ref', t => {
  const renderer: EnumControl = new EnumControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  dataService.notifyAboutDataChange(null, false);
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});

test('EnumControl dataService notification undefined ref', t => {
  const renderer: EnumControl = new EnumControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  dataService.notifyAboutDataChange(undefined, false);
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});

test('EnumControl dataService no notification after disconnect', t => {
  const renderer: EnumControl = new EnumControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLSelectElement;
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});

test('EnumControl notify visible false', t => {
  testHide(t, new EnumControl());
});

test('EnumControl notify visible true', t => {
  testShow(t, new EnumControl());
});

test('EnumControl notify disabled', t => {
  testDisable(t, new EnumControl());
});

test('EnumControl notify enabled', t => {
  testEnable(t, new EnumControl());
});

test('EnumControl notify one error', t => {
  testOneError(t, new EnumControl());
});

test('EnumControl notify multiple errors', t => {
  testMultipleErrors(t, new EnumControl());
});

test('EnumControl notify errors undefined', t => {
  testUndefinedErrors(t, new EnumControl());
});

test('EnumControl notify errors null', t => {
  testNullErrors(t, new EnumControl());
});

test('EnumControl notify errors clean', t => {
  testResetErrors(t, new EnumControl());
});

test('EnumControl disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new EnumControl());
});

test('EnumControl disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new EnumControl());
});

test('EnumControl disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new EnumControl());
});

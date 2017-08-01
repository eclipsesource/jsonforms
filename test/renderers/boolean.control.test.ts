import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { ControlElement } from '../../src/models/uischema';
import { BooleanControl, booleanControlTester } from '../../src/renderers/controls/boolean.control';
import { JsonForms } from '../../src/core';
import {
  testDisable, testEnable, testHide,
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
test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]);
});
test.beforeEach(t => {
  t.context.data = { 'foo': true };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean'
      }
    }
  };
  t.context.uiSchema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
});

test('BooleanControlTester', t => {
  t.is(booleanControlTester(undefined, undefined), -1);
  t.is(booleanControlTester(null, undefined), -1);
  t.is(booleanControlTester({type: 'Foo'}, undefined), -1);
  t.is(booleanControlTester({type: 'Control'}, undefined), -1);
});

test('BooleanControl tester with wrong prop type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      booleanControlTester(
          control,
          {type: 'object', properties: {foo: {type: 'string'}}}
      ),
      -1
  );
});

test('Boolean control tester with wrong prop type, but sibling has correct one', t => {
  const control = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      booleanControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              },
              bar: {
                type: 'boolean'
              }
            }
          }
      ),
      -1
  );
});

test('BooleanControl tester with matching prop type', t => {
  const control = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      booleanControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'boolean'
              }
            }
          }
      ),
      2);
});

test('BooleanControl static', t => {
  const renderer: BooleanControl = new BooleanControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const className = result.className;
  t.true(className.indexOf('root_properties_foo') !== -1);
  t.true(className.indexOf('control') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Foo');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'checkbox');
  t.is(input.checked, true);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('BooleanControl static no label', t => {
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': false};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(t.context.schema);
  const controlWithoutLabel: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: false
  };
  renderer.setUiSchema(controlWithoutLabel);
  const result = renderer.render();
  t.true(result.className.indexOf('control') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'checkbox');
  t.is(input.checked, false);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('BooleanControl inputChange', t => {
  const renderer: BooleanControl = new BooleanControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.checked = false;
  input.onchange(null);
  t.is(t.context.data.foo, false);
});

test('BooleanControl dataService notification', t => {
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': false};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, true);
  t.is(input.checked, true);
});

test('BooleanControl dataService notification value undefined', t => {
  const renderer: BooleanControl = new BooleanControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(
      {
        scope: {
          $ref: '#/properties/foo'
        }
      },
      undefined
  );
  t.is(input.checked, false);
});

test('BooleanControl dataService notification value null', t => {
  const renderer: BooleanControl = new BooleanControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.checked, false);
});

test('BooleanControl dataService notification wrong ref', t => {
  const renderer: BooleanControl = new BooleanControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.checked, true);
});

test('BooleanControl dataService notification null ref', t => {
  const renderer: BooleanControl = new BooleanControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(null, false);
  t.is(input.checked, true);
});

test('BooleanControl dataService notification undefined ref', t => {
  const renderer: BooleanControl = new BooleanControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(undefined, false);
  t.is(input.checked, true);
});

test('BooleanControl dataService no notification after disconnect', t => {
  const renderer: BooleanControl = new BooleanControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.checked, true);
});

test('BooleanControl notify visible false', t => {
  testHide(t, new BooleanControl());
});

test('BooleanControl notify visible true', t => {
  testShow(t, new BooleanControl());
});

test('BooleanControl notify disabled', t => {
  testDisable(t, new BooleanControl());
});

test('BooleanControl notify enabled', t => {
  testEnable(t, new BooleanControl());
});

test('BooleanControl notify one error', t => {
  testOneError(t, new BooleanControl());
});

test('BooleanControl notify multiple errors', t => {
  testMultipleErrors(t, new BooleanControl());

});

test('BooleanControl notify errors undefined', t => {
  testUndefinedErrors(t, new BooleanControl());
});

test('BooleanControl notify errors null', t => {
  testNullErrors(t, new BooleanControl());
});

test('BooleanControl notify errors clean', t => {
  testResetErrors(t, new BooleanControl());
});

test('BooleanControl disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new BooleanControl());
});

test('BooleanControl disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new BooleanControl());
});

test('BooleanControl disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new BooleanControl());
});

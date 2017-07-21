import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { ControlElement } from '../../src/models/uischema';
import {
  TextAreaControl,
  textAreaControlTester,
} from '../../src/renderers/controls/textarea.control';
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
  t.context.data = {'name': 'Foo'};
  t.context.schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  t.context.uiSchema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/name'
    }
  };
});

test('TextAreaControlTester', t => {
  t.is(textAreaControlTester(undefined, undefined), -1);
  t.is(textAreaControlTester(null, undefined), -1);
  t.is(textAreaControlTester({type: 'Foo'}, undefined), -1);
  t.is(textAreaControlTester({type: 'Control'}, undefined), -1);
  t.is(textAreaControlTester({type: 'Control', options: {multi: true}}, undefined), 2);
});

test('TextAreaControl static', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  t.is(result.id, t.context.uiSchema.scope.$ref);
  t.is(result.className, 'control');
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Name');
  const input = result.children[1] as HTMLTextAreaElement;
  t.is(input.tagName, 'TEXTAREA');
  t.is(input.value, 'Foo');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('TextAreaControl static no label', t => {
  const uiSchemaWithoutLabel: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/name'
    },
    label: false
  };
  const renderer: TextAreaControl = new TextAreaControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(uiSchemaWithoutLabel);
  const result = renderer.render();
  t.is(result.className, 'control');
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = result.children[1] as HTMLTextAreaElement;
  t.is(input.tagName, 'TEXTAREA');
  t.is(input.value, 'Foo');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('TextAreaControl inputChange', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLTextAreaElement;
  input.value = 'Bar';
  input.oninput(null);
  t.is(t.context.data.name, 'Bar');
});

test('TextAreaControl dataService notification', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/name'}}, 'Bar');
  t.is(input.value, 'Bar');
});

test('TextAreaControl dataService notification value undefined', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  dataService.notifyAboutDataChange(
      {
        scope: {
          $ref: '#/properties/name'
        }
      },
      undefined
  );
  t.is(input.value, '');
});

test('TextAreaControl dataService notification value null', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/name'}}, null);
  t.is(input.value, '');
});

test('TextAreaControl dataService notification wrong ref', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  const differentControl: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/firstname'
    }
  };
  dataService.notifyAboutDataChange(
      differentControl,
      'Bar'
  );
  t.is(input.value, 'Foo');
});

test('TextAreaControl dataService notification null ref', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  dataService.notifyAboutDataChange(null, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextAreaControl dataService notification undefined ref', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  dataService.notifyAboutDataChange(undefined, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextAreaControl dataService no notification after disconnect', t => {
  const renderer: TextAreaControl = new TextAreaControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLTextAreaElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/name'}}, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextAreaControl notify visible false', t => {
  testHide(t, new TextAreaControl());
});

test('TextAreaControl notify visible true', t => {
  testShow(t, new TextAreaControl());
});

test('TextAreaControl notify disabled', t => {
  testDisable(t, new TextAreaControl());
});

test('TextAreaControl notify enabled', t => {
  testEnable(t, new TextAreaControl());
});

test('TextAreaControl notify one error', t => {
  testOneError(t, new TextAreaControl());
});

test('TextAreaControl notify multiple errors', t => {
  testMultipleErrors(t, new TextAreaControl());
});

test('TextAreaControl notify errors undefined', t => {
  testUndefinedErrors(t, new TextAreaControl());
});

test('TextAreaControl notify errors null', t => {
  testNullErrors(t, new TextAreaControl());
});

test('TextAreaControl notify errors clean', t => {
  testResetErrors(t, new TextAreaControl());
});

test('TextAreaControl disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new TextAreaControl());
});

test('TextAreaControl disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new TextAreaControl());
});

test('TextAreaControl disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new TextAreaControl());
});

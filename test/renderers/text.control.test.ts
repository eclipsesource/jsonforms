import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ControlElement } from '../../src/models/uischema';
import { TextControl, textControlTester } from '../../src/renderers/controls/text.control';
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

test.beforeEach(t => {
  t.context.data =  { 'name': 'Foo' };
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

test('TextControlTester', t => {
  t.is(
      textControlTester(undefined, undefined),
      -1
  );
  t.is(
      textControlTester(null, undefined),
      -1
  );
  t.is(
      textControlTester({type: 'Foo'}, undefined),
      -1
  );
  t.is(
      textControlTester({type: 'Control'}, undefined),
      1
  );
});

test('TextControl static', t => {
  const schema: JsonSchema = {type: 'object', properties: {name: {type: 'string'}}};
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const className = result.className;
  t.true(className.indexOf('root_properties_name') !== -1);
  t.true(className.indexOf('control') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Name');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'text');
  t.is(input.value, 'Foo');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('TextControl static no label', t => {
  const renderer: TextControl = new TextControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  const controlWithLabel: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/name'
    },
    label: false
  };
  renderer.setUiSchema(controlWithLabel);
  const result = renderer.render();
  const className = result.className;
  t.true(className.indexOf('control') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'text');
  t.is(input.value, 'Foo');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('TextControl inputChange', t => {
  const renderer: TextControl = new TextControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.value = 'Bar';
  input.oninput(null);
  t.is(t.context.data.name, 'Bar');
});

test('TextControl dataService notification', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/name'}}, 'Bar');
  t.is(input.value, 'Bar');
});

test('TextControl dataService notification value undefined', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(
      t.context.uiSchema,
      undefined
  );
  t.is(input.value, '');
});

test('TextControl dataService notification value null', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/name'}}, null);
  t.is(input.value, '');
});

test('TextControl dataService notification wrong ref', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  const differentControl: ControlElement  = {
    type: 'Control',
    scope: {
      $ref: '#/properties/firstname'
    }
  };
  dataService.notifyAboutDataChange(differentControl, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextControl dataService notification null ref', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(null, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextControl dataService notification undefined ref', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(undefined, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextControl dataService no notification after disconnect', t => {
  const renderer: TextControl = new TextControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(t.context.uiSchema, 'Bar');
  t.is(input.value, 'Foo');
});

test('TextControl notify visible false', t => {
  testHide(t, new TextControl());
});

test('TextControl notify visible true', t => {
  testShow(t, new TextControl());
});

test('TextControl notify disabled', t => {
  testDisable(t, new TextControl());
});

test('TextControl notify enabled', t => {
  testEnable(t, new TextControl());
});

test('TextControl notify one error', t => {
  testOneError(t, new TextControl());
});

test('TextControl notify multiple errors', t => {
  testMultipleErrors(t, new TextControl());
});

test('TextControl notify errors undefined', t => {
  testUndefinedErrors(t, new TextControl());
});

test('TextControl notify errors null', t => {
  testNullErrors(t, new TextControl());
});

test('TextControl notify errors clean', t => {
  testResetErrors(t, new TextControl());
});

test('TextControl disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new TextControl());
});

test('TextControl disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new TextControl());
});

test('TextControl disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new TextControl());
});

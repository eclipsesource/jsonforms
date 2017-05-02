import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
import {ControlElement} from '../../src/models/uischema';
import {JsonSchema} from '../../src/models/jsonSchema';
import {textControlTester, TextControl} from '../../src/renderers/controls/text.control';
import {Runtime} from '../../src/core/runtime';
import {DataService } from '../../src/core/data.service';


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
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'control')
  t.is(result.childNodes.length, 3);
  const label = <HTMLLabelElement>result.children[0];
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Name');
  const input = <HTMLInputElement>result.children[1];
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'text');
  t.is(input.value, 'Foo');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('TextControl static no label', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'},
    label: false} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'control')
  t.is(result.childNodes.length, 3);
  const label = <HTMLLabelElement>result.children[0];
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = <HTMLInputElement>result.children[1];
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'text');
  t.is(input.value, 'Foo');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('TextControl inputChange', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.value = 'Bar';
  input.oninput(null);
  t.is(data.name, 'Bar');
});
test('TextControl dataService notification', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/name'}}, 'Bar');
  t.is(input.value, 'Bar');
});
test('TextControl dataService notification value undefined', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/name'}}, undefined);
  t.is(input.value, '');
});
test('TextControl dataService notification value null', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/name'}}, null);
  t.is(input.value, '');
});
test('TextControl dataService notification wrong ref', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/firstname'}}, 'Bar');
  t.is(input.value, 'Foo');
});
test('TextControl dataService notification null ref', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(null, 'Bar');
  t.is(input.value, 'Foo');
});
test('TextControl dataService notification undefined ref', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(undefined, 'Bar');
  t.is(input.value, 'Foo');
});
test('TextControl dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: TextControl = new TextControl();
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/name'}}, 'Bar');
  t.is(input.value, 'Foo');
});
test('TextControl notify visible false', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('TextControl notify visible true', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = true;
  t.is(renderer.hidden, false);
});

test('TextControl notify disabled', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLInputElement>renderer.children[1];
  t.is(input.getAttribute('disabled'), 'true');
  // TODO would be nice
  // t.is(input.disabled, true);
});
test('TextControl notify enabled', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = true;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});

test('TextControl notify one error', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a');
});
test('TextControl notify multiple errors', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a', 'error b'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a\nerror b');
});
test('TextControl notify errors undefined', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('TextControl notify errors null', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = null;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('TextControl notify errors clean', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('TextControl disconnected no notify visible', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
test('TextControl disconnected no notify enabled', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});
test('TextControl disconnected no notify error', t => {
  const renderer: TextControl = new TextControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
  const data = {'name': 'Foo'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.not(errorsDiv.textContent, 'error a',
    'Diconnected Controls should not be notified about new errors.');
});

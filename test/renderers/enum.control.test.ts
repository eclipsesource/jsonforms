import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {ControlElement} from '../../src/models/uischema';
import {JsonSchema} from '../../src/models/jsonSchema';
import {enumControlTester, EnumControl} from '../../src/renderers/controls/enum.control';
import {Runtime, RUNTIME_TYPE} from '../../src/core/runtime';
import {DataService } from '../../src/core/data.service';


test('EnumControlTester', t => {
  t.is(enumControlTester(undefined, undefined), -1);
  t.is(enumControlTester(null, undefined), -1);
  t.is(enumControlTester({type: 'Foo'}, undefined), -1);
  t.is(enumControlTester({type: 'Control'}, undefined), -1);
  t.is(enumControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}}}), -1);
  t.is(enumControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {
      foo: {type: 'string'}, bar: {type: 'string', enum: ['a', 'b']}}}), -1);
  t.is(enumControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string', enum: ['a', 'b']}}}), 2);
  // TODO should this be true?
  t.is(enumControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'number', enum: [1, 2]}}}), 2);
});
test('EnumControl static', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'control')
  t.is(result.childNodes.length, 3);
  const label = <HTMLLabelElement>result.children[0];
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Foo');
  const input = <HTMLSelectElement>result.children[1];
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
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'b'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'},
    label: false} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'control')
  t.is(result.childNodes.length, 3);
  const label = <HTMLLabelElement>result.children[0];
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = <HTMLSelectElement>result.children[1];
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
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLSelectElement>result.children[1];
  input.value = 'b';
  input.onchange(null);
  t.is(data.foo, 'b');
});
test('EnumControl dataService notification', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  t.is(input.selectedIndex, 1);
  t.is(input.value, 'b');
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'a');
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});
test.failing('EnumControl dataService notification value undefined', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, undefined);
  t.is(input.selectedIndex, -1);
});
test.failing('EnumControl dataService notification value null', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.selectedIndex, -1);
});
test('EnumControl dataService notification wrong ref', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});
test('EnumControl dataService notification null ref', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  dataService.notifyAboutDataChange(null, false);
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});
test('EnumControl dataService notification undefined ref', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  dataService.notifyAboutDataChange(undefined, false);
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});
test('EnumControl dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  const renderer: EnumControl = new EnumControl();
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = <HTMLSelectElement>renderer.children[1];
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.value, 'a');
  t.is(input.selectedIndex, 0);
});
test('EnumControl notify visible false', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('EnumControl notify visible true', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = true;
  t.is(renderer.hidden, false);
});

test('EnumControl notify disabled', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLSelectElement>renderer.children[1];
  t.is(input.getAttribute('disabled'), 'true');
  // TODO would be nice
  // t.is(input.disabled, true);
});
test('EnumControl notify enabled', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = true;
  const input = <HTMLSelectElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});

test('EnumControl notify one error', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a');
});
test('EnumControl notify multiple errors', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a', 'error b'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a\nerror b');
});
test('EnumControl notify errors undefined', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('EnumControl notify errors null', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = null;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('EnumControl notify errors clean', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('EnumControl disconnected no notify visible', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
test('EnumControl disconnected no notify enabled', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'b'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLSelectElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});
test('EnumControl disconnected no notify error', t => {
  const renderer: EnumControl = new EnumControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 'a'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties:
    {foo: {type: 'string', enum: ['a', 'b']}}} as JsonSchema;
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

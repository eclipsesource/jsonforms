import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {ControlElement} from '../../src/models/uischema';
import {JsonSchema} from '../../src/models/jsonSchema';
import {dateControlTester, DateControl} from '../../src/renderers/controls/date.control';
import {Runtime, RUNTIME_TYPE} from '../../src/core/runtime';
import {DataService } from '../../src/core/data.service';


test('DateControlTester', t => {
  t.is(-1, dateControlTester(undefined, undefined));
  t.is(-1, dateControlTester(null, undefined));
  t.is(-1, dateControlTester({type: 'Foo'}, undefined));
  t.is(-1, dateControlTester({type: 'Control'}, undefined));
  t.is(-1, dateControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}}}));
  t.is(-1, dateControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'string', format: 'date'}}}));
  t.is(2, dateControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string', format: 'date'}}}));
});
test('DateControl static', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'control')
  t.is(result.childNodes.length, 3);
  const label = <HTMLLabelElement>result.children[0];
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Foo');
  const input = <HTMLInputElement>result.children[1];
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'date');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('DateControl static no label', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1961-04-12'};
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
  const input = <HTMLInputElement>result.children[1];
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'date');
  t.deepEqual(input.valueAsDate, new Date('1961-04-12'));
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('DateControl inputChange', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.valueAsDate = new Date('1961-04-12');
  input.oninput(null);
  t.is(data.foo, '1961-04-12');
});
test('DateControl inputChange null', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.valueAsDate = null;
  input.oninput(null);
  t.is(data.foo, undefined);
});
test('DateControl inputChange undefined', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.valueAsDate = undefined;
  input.oninput(null);
  t.is(data.foo, undefined);
});
test('DateControl dataService notification', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1961-04-12'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, '1980-04-04');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
test.failing('DateControl dataService notification value undefined', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, undefined);
  t.is(input.valueAsDate, null);
});
test.failing('DateControl dataService notification value null', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.valueAsDate, null);
});
test('DateControl dataService notification wrong ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
test('DateControl dataService notification null ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(null, '1961-04-12');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
test('DateControl dataService notification undefined ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(undefined, '1961-04-12');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
test('DateControl dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
test('DateControl notify visible false', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('DateControl notify visible true', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = true;
  t.is(renderer.hidden, false);
});

test('DateControl notify disabled', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
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
test('DateControl notify enabled', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = true;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});

test('DateControl notify one error', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a');
});
test('DateControl notify multiple errors', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a', 'error b'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a\nerror b');
});
test('DateControl notify errors undefined', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('DateControl notify errors null', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = null;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('DateControl notify errors clean', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('DateControl disconnected no notify visible', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
test('DateControl disconnected no notify enabled', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});
test('DateControl disconnected no notify error', t => {
  const renderer: DateControl = new DateControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': '1980-04-04'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'date'}}} as JsonSchema;
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

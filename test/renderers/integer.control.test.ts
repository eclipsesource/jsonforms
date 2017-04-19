import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {ControlElement} from '../../src/models/uischema';
import {JsonSchema} from '../../src/models/jsonSchema';
import {numberControlTester, NumberControl} from '../../src/renderers/controls/number.control';
import {Runtime, RUNTIME_TYPE} from '../../src/core/runtime';
import {DataService } from '../../src/core/data.service';


test('NumberControlTester', t => {
  t.is(-1, numberControlTester(undefined, undefined));
  t.is(-1, numberControlTester(null, undefined));
  t.is(-1, numberControlTester({type: 'Foo'}, undefined));
  t.is(-1, numberControlTester({type: 'Control'}, undefined));
  t.is(-1, numberControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}}}));
  t.is(-1, numberControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'number'}}}));
  t.is(2, numberControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'number'}}}));
});
test('NumberControl static', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
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
  t.is(input.type, 'number');
  t.is(input.step, '0.1');
  t.is(input.valueAsNumber, 3.14);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('NumberControl static no label', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 2.72};
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
  t.is(input.type, 'number');
  t.is(input.step, '0.1');
  t.is(input.valueAsNumber, 2.72);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('NumberControl inputChange', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.valueAsNumber = 2.72;
  input.oninput(null);
  t.is(data.foo, 2.72);
});
test('NumberControl dataService notification', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 2.72};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 3.14);
  t.is(input.valueAsNumber, 3.14);
});
test('NumberControl dataService notification value undefined', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, undefined);
  t.is(input.valueAsNumber, undefined);
});
test('NumberControl dataService notification value null', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.valueAsNumber, undefined);
});
test('NumberControl dataService notification wrong ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.valueAsNumber, 3.14);
});
test('NumberControl dataService notification null ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(null, 2.72);
  t.is(input.valueAsNumber, 3.14);
});
test('NumberControl dataService notification undefined ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(undefined, 2.72);
  t.is(input.valueAsNumber, 3.14);
});
test('NumberControl dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.valueAsNumber, 3.14);
});
test('NumberControl notify visible false', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('NumberControl notify visible true', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = true;
  t.is(renderer.hidden, false);
});

test('NumberControl notify disabled', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
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
test('NumberControl notify enabled', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = true;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});

test('NumberControl notify one error', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a');
});
test('NumberControl notify multiple errors', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a', 'error b'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a\nerror b');
});
test('NumberControl notify errors undefined', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('NumberControl notify errors null', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = null;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('NumberControl notify errors clean', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('NumberControl disconnected no notify visible', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
test('NumberControl disconnected no notify enabled', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});
test('NumberControl disconnected no notify error', t => {
  const renderer: NumberControl = new NumberControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 3.14};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'number'}}} as JsonSchema;
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

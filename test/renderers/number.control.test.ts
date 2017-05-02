import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {ControlElement} from '../../src/models/uischema';
import {JsonSchema} from '../../src/models/jsonSchema';
import {integerControlTester, IntegerControl} from '../../src/renderers/controls/integer.control';
import {Runtime, RUNTIME_TYPE} from '../../src/core/runtime';
import {DataService } from '../../src/core/data.service';


test('IntegerControlTester', t => {
  t.is(integerControlTester(undefined, undefined), -1);
  t.is(integerControlTester(null, undefined), -1);
  t.is(integerControlTester({type: 'Foo'}, undefined), -1);
  t.is(integerControlTester({type: 'Control'}, undefined), -1);
  t.is(integerControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}}}), -1);
  t.is(integerControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'integer'}}}), -1);
  t.is(integerControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'integer'}}}), 2);
});
test('IntegerControl static', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
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
  t.is(input.step, '1');
  t.is(input.valueAsNumber, 42);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('IntegerControl static no label', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 13};
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
  t.is(input.step, '1');
  t.is(input.valueAsNumber, 13);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('IntegerControl inputChange', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.valueAsNumber = 13;
  input.oninput(null);
  t.is(data.foo, 13);
});
test('IntegerControl dataService notification', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 13};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 42);
  t.is(input.valueAsNumber, 42);
});
test('IntegerControl dataService notification value undefined', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, undefined);
  t.is(input.valueAsNumber, undefined);
});
test('IntegerControl dataService notification value null', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.valueAsNumber, undefined);
});
test('IntegerControl dataService notification wrong ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.valueAsNumber, 42);
});
test('IntegerControl dataService notification null ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(null, 13);
  t.is(input.valueAsNumber, 42);
});
test('IntegerControl dataService notification undefined ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange(undefined, 13);
  t.is(input.valueAsNumber, 42);
});
test('IntegerControl dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = <HTMLInputElement>renderer.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.valueAsNumber, 42);
});
test('IntegerControl notify visible false', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('IntegerControl notify visible true', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = true;
  t.is(renderer.hidden, false);
});

test('IntegerControl notify disabled', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
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
test('IntegerControl notify enabled', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = true;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});

test('IntegerControl notify one error', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a');
});
test('IntegerControl notify multiple errors', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a', 'error b'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a\nerror b');
});
test('IntegerControl notify errors undefined', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('IntegerControl notify errors null', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = null;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('IntegerControl notify errors clean', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('IntegerControl disconnected no notify visible', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
test('IntegerControl disconnected no notify enabled', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});
test('IntegerControl disconnected no notify error', t => {
  const renderer: IntegerControl = new IntegerControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': 42};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'integer'}}} as JsonSchema;
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

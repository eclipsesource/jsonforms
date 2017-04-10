import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {ControlElement} from '../src/models/uischema';
import {JsonSchema} from '../src/models/jsonSchema';
import {booleanControlTester, BooleanControl} from '../src/renderers/controls/boolean.control';
import {Runtime, RUNTIME_TYPE} from '../src/core/runtime';
import {DataService } from '../src/core/data.service';


test('BooleanControlTester', t => {
  t.is(-1, booleanControlTester(undefined, undefined));
  t.is(-1, booleanControlTester(null, undefined));
  t.is(-1, booleanControlTester({type: 'Foo'}, undefined));
  t.is(-1, booleanControlTester({type: 'Control'}, undefined));
  t.is(-1, booleanControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}}}));
  t.is(-1, booleanControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'boolean'}}}));
  t.is(2, booleanControlTester(
    {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement,
    {type: 'object', properties: {foo: {type: 'boolean'}}}));
});
test('BooleanControl static', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
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
  t.is(input.type, 'checkbox');
  t.is(input.checked, true);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('BooleanControl static no label', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': false};
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
  t.is(input.type, 'checkbox');
  t.is(input.checked, false);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('BooleanControl inputChange', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  input.checked = false;
  input.onchange(null);
  t.is(data.foo, false);
});
// TODO If I add console log, then I see that the value is set, but cannot verify
test.failing('BooleanControl dataService notification', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': false};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, true);
  t.is(input.checked, true);
});
test.failing('BooleanControl dataService notification value undefined', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, undefined);
  t.is(input.checked, false);
});
test.failing('BooleanControl dataService notification value null', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.checked, false);
});
test('BooleanControl dataService notification wrong ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.checked, true);
});
test('BooleanControl dataService notification null ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange(null, false);
  t.is(input.checked, true);
});
test('BooleanControl dataService notification undefined ref', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange(undefined, false);
  t.is(input.checked, true);
});
test('BooleanControl dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  const renderer: BooleanControl = new BooleanControl();
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement);
  renderer.connectedCallback();
  const result = renderer.render();
  renderer.disconnectedCallback();
  const input = <HTMLInputElement>result.children[1];
  dataService.notifyChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.checked, true);
});
test('BooleanControl notify visible false', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('BooleanControl notify visible true', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = true;
  t.is(renderer.hidden, false);
});

test('BooleanControl notify disabled', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
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
test('BooleanControl notify enabled', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = true;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});

test('BooleanControl notify one error', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a');
});
test('BooleanControl notify multiple errors', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a', 'error b'];
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, 'error a\nerror b');
});
test('BooleanControl notify errors undefined', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('BooleanControl notify errors null', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = null;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('BooleanControl notify errors clean', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.validationErrors = ['error a'];
  runtime.validationErrors = undefined;
  const errorsDiv = renderer.getElementsByClassName('validation')[0];
  t.is(errorsDiv.textContent, '');
});
test('BooleanControl disconnected no notify visible', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
test('BooleanControl disconnected no notify enabled', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
  renderer.setDataSchema(schema);
  renderer.setUiSchema(controlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>controlElement['runtime'];
  runtime.enabled = false;
  const input = <HTMLInputElement>renderer.children[1];
  t.false(input.hasAttribute('disabled'));
});
test('BooleanControl disconnected no notify error', t => {
  const renderer: BooleanControl = new BooleanControl();
  const controlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const data = {'foo': true};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  const schema = {type: 'object', properties: {foo: {type: 'boolean'}}} as JsonSchema;
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

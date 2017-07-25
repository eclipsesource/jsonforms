import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { ControlElement } from '../../src/models/uischema';
import { IntegerControl, integerControlTester } from '../../src/renderers/controls/integer.control';
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
  testUndefinedErrors,
} from './base.control.tests';

test.beforeEach(t => {
  t.context.data = {'foo': 42};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'integer',
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

test('IntegerControlTester', t => {
  t.is(integerControlTester(undefined, undefined), -1);
  t.is(integerControlTester(null, undefined), -1);
  t.is(integerControlTester({type: 'Foo'}, undefined), -1);
  t.is(integerControlTester({type: 'Control'}, undefined), -1);

  const controlElement: ControlElement = {
    type: 'Control',
        scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      integerControlTester(
          controlElement,
          {type: 'object', properties: {foo: {type: 'string'}}}
      ),
      -1
  );
  t.is(
      integerControlTester(
          controlElement,
          {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'integer'}}}
      ),
      -1
  );
  t.is(
      integerControlTester(
          controlElement,
          {type: 'object', properties: {foo: {type: 'integer'}}}),
      2
  );
});

test('IntegerControl static', t => {
  const renderer: IntegerControl = new IntegerControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  t.is(result.className, 'control');
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Foo');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'number');
  t.is(input.step, '1');
  t.is(input.valueAsNumber, 42);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('IntegerControl static no label', t => {
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 13};
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
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'number');
  t.is(input.step, '1');
  t.is(input.valueAsNumber, 13);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('IntegerControl inputChange', t => {
  const renderer: IntegerControl = new IntegerControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.valueAsNumber = 13;
  input.oninput(null);
  t.is(t.context.data.foo, 13);
});

test('IntegerControl dataService notification', t => {
  const renderer: IntegerControl = new IntegerControl();
  const data = {'foo': 13};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, 42);
  t.is(input.valueAsNumber, 42);
});

test('IntegerControl dataService notification value undefined', t => {
  const renderer: IntegerControl = new IntegerControl();
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
  t.is(input.valueAsNumber, undefined);
});

test('IntegerControl dataService notification value null', t => {
  const renderer: IntegerControl = new IntegerControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.valueAsNumber, undefined);
});

test('IntegerControl dataService notification wrong ref', t => {
  const renderer: IntegerControl = new IntegerControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.valueAsNumber, 42);
});

test('IntegerControl dataService notification null ref', t => {
  const renderer: IntegerControl = new IntegerControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(null, 13);
  t.is(input.valueAsNumber, 42);
});

test('IntegerControl dataService notification undefined ref', t => {
  const renderer: IntegerControl = new IntegerControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(undefined, 13);
  t.is(input.valueAsNumber, 42);
});

test('IntegerControl dataService no notification after disconnect', t => {
  const renderer: IntegerControl = new IntegerControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.valueAsNumber, 42);
});

test('Integer control notify visible false', t => {
  testHide(t, new IntegerControl());
});

test('Integer control notify visible true', t => {
  testShow(t, new IntegerControl());
});

test('Integer control notify disabled', t => {
  testDisable(t, new IntegerControl());
});

test('Integer control notify enabled', t => {
  testEnable(t, new IntegerControl());
});

test('Integer control notify one error', t => {
  testOneError(t, new IntegerControl());
});

test('Integer control notify multiple errors', t => {
  testMultipleErrors(t, new IntegerControl());
});

test('Integer control notify errors undefined', t => {
  testUndefinedErrors(t, new IntegerControl());
});

test('Integer control notify errors null', t => {
  testNullErrors(t, new IntegerControl());
});

test('Integer control notify errors clean', t => {
  testResetErrors(t, new IntegerControl());
});

test('Integer control disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new IntegerControl());
});

test('Integer control disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new IntegerControl());
});

test('Integer control disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new IntegerControl());
});

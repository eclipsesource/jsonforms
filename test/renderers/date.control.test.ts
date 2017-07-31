import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { ControlElement } from '../../src/models/uischema';
import { DateControl, dateControlTester } from '../../src/renderers/controls/date.control';
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
  t.context.data = {'foo': '1980-04-04'};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'date',
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

test('DateControlTester', t => {
  t.is(dateControlTester(undefined, undefined), -1);
  t.is(dateControlTester(null, undefined), -1);
  t.is(dateControlTester({type: 'Foo'}, undefined), -1);
  t.is(dateControlTester({type: 'Control'}, undefined), -1);
});

test('DateControl tester with wrong prop type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    }
  };
  t.is(
      dateControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {type: 'string'},
            },
          },
      ),
      -1,
  );
});

test('DateControl tester with wrong prop type, but sibling has correct one', t => {
  const control = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
  };
  t.is(
      dateControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {type: 'string'},
              bar: {
                type: 'string',
                format: 'date',
              },
            },
          },
      ),
      -1,
  );
});

test('DateControl tester with correct prop type', t => {
  const control = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
  };
  t.is(
      dateControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
                format: 'date',
              },
            },
          },
      ),
      2,
  );
});

test('DateControl static', t => {
  const renderer: DateControl = new DateControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const className = result.className;
  t.true(className.indexOf('root_properties_foo') !== -1);
  t.true(result.className.indexOf('control') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Foo');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'date');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('DateControl static no label', t => {
  const data = { 'foo': '1961-04-12' };
  const uiSchema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
    label: false,
  };
  const renderer: DateControl = new DateControl();
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  const className = result.className;
  t.true(result.className.indexOf('control') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'date');
  t.deepEqual(input.valueAsDate, new Date('1961-04-12'));
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('DateControl inputChange', t => {
  const renderer: DateControl = new DateControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.valueAsDate = new Date('1961-04-12');
  input.oninput(null);
  t.is(t.context.data.foo, '1961-04-12');
});

test('DateControl inputChange null', t => {
  const renderer: DateControl = new DateControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.valueAsDate = null;
  input.oninput(null);
  t.is(t.context.data.foo, undefined);
});

test('DateControl inputChange undefined', t => {
  const renderer: DateControl = new DateControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.valueAsDate = undefined;
  input.oninput(null);
  t.is(t.context.data.foo, undefined);
});

test('DateControl dataService notification', t => {
  const renderer: DateControl = new DateControl();
  const data = {'foo': '1961-04-12'};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(
      t.context.uiSchema,
      '1980-04-04',
  );
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});

test.failing('DateControl dataService notification value undefined', t => {
  const renderer: DateControl = new DateControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(
      t.context.uiSchema,
      undefined,
  );
  t.is(input.valueAsDate, null);
});

test.failing('DateControl dataService notification value null', t => {
  const renderer: DateControl = new DateControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.valueAsDate, null);
});

test('DateControl dataService notification wrong ref', t => {
  const renderer: DateControl = new DateControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});

test('DateControl dataService notification null ref', t => {
  const renderer: DateControl = new DateControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(null, '1961-04-12');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});

test('DateControl dataService notification undefined ref', t => {
  const renderer: DateControl = new DateControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(undefined, '1961-04-12');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});

test('DateControl dataService no notification after disconnect', t => {
  const renderer: DateControl = new DateControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});

test('DateControl notify visible false', t => {
  testHide(t, new DateControl());
});

test('DateControl notify visible true', t => {
  testShow(t, new DateControl());
});

test('DateControl notify disabled', t => {
  testDisable(t, new DateControl());
});

test('DateControl notify enabled', t => {
  testEnable(t, new DateControl());
});

test('DateControl notify one error', t => {
  testOneError(t, new DateControl());
});

test('DateControl notify multiple errors', t => {
  testMultipleErrors(t, new DateControl());
});

test('DateControl notify errors undefined', t => {
  testUndefinedErrors(t, new DateControl());
});

test('DateControl notify errors null', t => {
  testNullErrors(t, new DateControl());
});

test('DateControl notify errors clean', t => {
  testResetErrors(t, new DateControl());
});

test('DateControl disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new DateControl());
});

test('DateControl disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new DateControl());
});

test('DateControl disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new DateControl());
});

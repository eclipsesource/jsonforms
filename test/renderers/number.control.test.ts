import test from 'ava';
// setup import must come first
import '../helpers/setup';
// tslint:disable:ordered-imports
import {DataService} from '../../src/core/data.service';
// tslint:enable:ordered-imports
import {JsonSchema} from '../../src/models/jsonSchema';
import {ControlElement} from '../../src/models/uischema';
import {NumberControl, numberControlTester} from '../../src/renderers/controls/number.control';
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
  t.context.data = {'foo': 3.14};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
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

test('NumberControlTester', t => {
  t.is(numberControlTester(undefined, undefined), -1);
  t.is(numberControlTester(null, undefined), -1);
  t.is(numberControlTester({type: 'Foo'}, undefined), -1);
  t.is(numberControlTester({type: 'Control'}, undefined), -1);
});

test('NumberControl tester with wrong schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      numberControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              }
            }
          }
      ),
      -1
  );
});

test('NumberControl tester with wrong schema type, but sibling has correct one', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      numberControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              },
              bar: {
                type: 'number'
              }
            }
          }
      ),
      -1
  );
});

test('NumberControl tester with machting schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      numberControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number'
              }
            }
          }
      ),
      2
  );
});

test('NumberControl static', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number'
      }
    }
  };
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 3.14};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
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
  t.is(input.step, '0.1');
  t.is(input.valueAsNumber, 3.14);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});
test('NumberControl static no label', t => {
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 2.72};
  const uiSchemaWithNoLabel: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: false
  };
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(uiSchemaWithNoLabel);
  const result = renderer.render();
  t.is(result.className, 'control');
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');
  const input = result.children[1] as HTMLInputElement;
  t.is(input.tagName, 'INPUT');
  t.is(input.type, 'number');
  t.is(input.step, '0.1');
  t.is(input.valueAsNumber, 2.72);
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('NumberControl inputChange', t => {
  const renderer: NumberControl = new NumberControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  const input = result.children[1] as HTMLInputElement;
  input.valueAsNumber = 2.72;
  input.oninput(null);
  t.is(t.context.data.foo, 2.72);
});

test('NumberControl dataService notification', t => {
  const renderer: NumberControl = new NumberControl();
  const data = {'foo': 2.72};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 3.14);
  t.is(input.valueAsNumber, 3.14);
});

test('NumberControl dataService notification value undefined', t => {
  const renderer: NumberControl = new NumberControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(
      {
        type: 'Control',
        scope: {
          $ref: '#/properties/foo'
        }
      },
      undefined
  );
  t.is(input.valueAsNumber, undefined);
});

test('NumberControl dataService notification value null', t => {
  const renderer: NumberControl = new NumberControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, null);
  t.is(input.valueAsNumber, undefined);
});

test('NumberControl dataService notification wrong ref', t => {
  const renderer: NumberControl = new NumberControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/bar'}}, 'Bar');
  t.is(input.valueAsNumber, 3.14);
});

test('NumberControl dataService notification null ref', t => {
  const renderer: NumberControl = new NumberControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(null, 2.72);
  t.is(input.valueAsNumber, 3.14);
});

test('NumberControl dataService notification undefined ref', t => {
  const renderer: NumberControl = new NumberControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange(undefined, 2.72);
  t.is(input.valueAsNumber, 3.14);
});

test('NumberControl dataService no notification after disconnect', t => {
  const renderer: NumberControl = new NumberControl();
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const input = renderer.children[1] as HTMLInputElement;
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/foo'}}, 'Bar');
  t.is(input.valueAsNumber, 3.14);
});

test('Number control notify visible false', t => {
  testHide(t, new NumberControl());
});

test('Number control notify visible true', t => {
  testShow(t, new NumberControl());
});

test('Number control notify disabled', t => {
  testDisable(t, new NumberControl());
});

test('Number control notify enabled', t => {
  testEnable(t, new NumberControl());
});

test('Number control notify one error', t => {
  testOneError(t, new NumberControl());
});

test('Number control notify multiple errors', t => {
  testMultipleErrors(t, new NumberControl());
});

test('Number control notify errors undefined', t => {
  testUndefinedErrors(t, new NumberControl());
});

test('Number control notify errors null', t => {
  testNullErrors(t, new NumberControl());
});

test('Number control notify errors clean', t => {
  testResetErrors(t, new NumberControl());
});

test('Number control disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new NumberControl());
});

test('Number control disconnected no notify enabled', t => {
  testNotifyAboutEnablementWhenDisconnected(t, new NumberControl());
});

test('Number control disconnected no notify error', t => {
  testNotifyAboutValidationWhenDisconnected(t, new NumberControl());
});

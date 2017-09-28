import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { JsonForms } from '../../src/core';
import { DataService } from '../../src/core/data.service';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ReferencePathControl } from '../../src/renderers/controls/reference.path.control';

test.beforeEach(t => {
  // Reset relevant static variables
  JsonForms.rootData = undefined;
  JsonForms.resources.clear();

  t.context.uiSchema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/ref',
    },
  };

  const targetSchema = {
    type: 'object',
    properties: {
      a: { type: 'string' }
    },
    required: ['a']
  };

  t.context.schema = {
    type: 'object',
    properties: {
      ref: { type: 'string' }
    },
    links: [
      {
        href: 'rs://data/{ref}',
        targetSchema: targetSchema
      }
    ]
  };

  t.context.refdata = {
    a: 'A',
    obj: {
      ted: {
        a: 'C'
      }
    }
  };

  t.context.data = { ref: '#/obj/ted' };
});

test('static', t => {
  JsonForms.schema = t.context.schema;
  JsonForms.resources.registerResource('data', t.context.refdata, false);
  const renderer: ReferencePathControl = new ReferencePathControl();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Ref');
  const input = result.children[1] as HTMLSelectElement;
  t.is(input.tagName, 'SELECT');
  t.is(input.options.length, 3);
  t.is(input.selectedIndex, 2);
  t.is(input.options.item(0).innerText, 'Select Reference Path...');
  t.is(input.options.item(1).value, '#');
  t.is(input.options.item(1).innerText, '#');
  t.is(input.options.item(2).value, '#/obj/ted');
  t.is(input.options.item(2).innerText, '#/obj/ted');
  t.is(input.value, '#/obj/ted');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

test('data change', t => {
  JsonForms.schema = t.context.schema;
  JsonForms.resources.registerResource('data', t.context.refdata, false);
  const renderer: ReferencePathControl = new ReferencePathControl();
  const dataService = new DataService({ ref: '#/obj/ted' });
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  // const result = renderer.render();
  const input = renderer.children[1] as HTMLSelectElement;
  t.is(input.tagName, 'SELECT');
  t.is(input.options.length, 3);
  t.is(input.selectedIndex, 2);
  t.is(input.value, '#/obj/ted');
  dataService.notifyAboutDataChange({scope: {$ref: '#/properties/ref'}}, '#');
  t.is(input.value, '#');
  t.is(input.selectedIndex, 1);
});

test('no referene property', t => {
  const schema = {
    type: 'object',
    properties: {
      ref: { type: 'string' }
    }
  };
  JsonForms.schema = schema;
  JsonForms.resources.registerResource('data', t.context.refdata, false);
  const renderer: ReferencePathControl = new ReferencePathControl();
  const dataService = new DataService({ ref: '#/obj/ted' });
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Ref');
  const input = result.children[1] as HTMLSelectElement;
  t.is(input.tagName, 'SELECT');
  t.is(input.options.length, 0);
  t.is(input.value, '');
  const validation = result.children[2];
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

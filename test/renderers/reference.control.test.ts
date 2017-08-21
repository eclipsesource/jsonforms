import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { JsonForms } from '../../src/core';
import { DataService } from '../../src/core/data.service';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ReferenceControl } from '../../src/renderers/controls/reference.control';
import { ReferenceControlTestImpl } from './reference.control.testimpl';

test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control-TEST']
    },
    {
      name: 'control.label',
      classNames: ['label-TEST']
    },
    {
      name: 'control.input',
      classNames: ['input-TEST']
    },
    {
      name: 'control.validation',
      classNames: ['validation-TEST']
    }
  ]);

  customElements.define('test-renderer', ReferenceControlTestImpl);
});

test.beforeEach(t => {
  t.context.schema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          association: {
            type: 'string'
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  };

  JsonForms.config.setIdentifyingProp('id');
  JsonForms.schema = t.context.schema;
  t.context.uiSchema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/association'
    }
  };
});

test('Abstract Reference Control - no pre-selection', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {classes: [{id: 'c1', name: 'CL1'}, {id: 'c2', name: 'CL2'}]};
  JsonForms.rootData = data;
  const renderer: ReferenceControl = new ReferenceControlTestImpl(data, 'name');
  renderer.setDataSchema(schema.definitions.class);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.setDataService(new DataService(data.classes[1]));
  const result = renderer.render();

  const className = result.className;
  t.true(className.indexOf('root_properties_association') !== -1);
  t.true(className.indexOf('control-TEST') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.true(label.className.indexOf('label-TEST') !== -1);
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Association');
  const input = result.children[1] as HTMLSelectElement;

  // Check combo box
  t.true(input.className.indexOf('input-TEST') !== -1);
  t.is(input.tagName, 'SELECT');
  t.is(input.children.length, 3);
  const defaultOption = input.children[0] as HTMLOptionElement;
  const option1 = input.children[1] as HTMLOptionElement;
  const option2 = input.children[2] as HTMLOptionElement;
  t.is(defaultOption.tagName, 'OPTION');
  t.is(option1.tagName, 'OPTION');
  t.is(option2.tagName, 'OPTION');
  t.is(option1.value, 'c1');
  t.is(option2.value, 'c2');
  t.is(defaultOption.innerText, 'Choose Reference Target...');
  t.is(option1.innerText, 'CL1');
  t.is(option2.innerText, 'CL2');
  t.true(defaultOption.disabled);
  t.true(defaultOption.hidden);
  // commented out because JsDom does not properly support the option's label property
  // t.is(option1.label, 'CL1');
  // t.is(option2.label, 'CL2');

  const validation = result.children[2];
  t.true(validation.className.indexOf('validation-TEST') !== -1);
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);

  /* tslint:disable:no-string-literal */
  t.is(data.classes[1]['association'], undefined);
  /* tslint:enable:no-string-literal */
});

test('Abstract Reference Control - pre-selection', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {classes: [{id: 'c1', name: 'CL1'}, {id: 'c2', name: 'CL2', association: 'c2'}]};
  JsonForms.rootData = data;
  const renderer: ReferenceControl = new ReferenceControlTestImpl(data, 'name');
  renderer.setDataSchema(schema.definitions.class);
  renderer.setUiSchema(t.context.uiSchema);
  renderer.setDataService(new DataService(data.classes[1]));
  const result = renderer.render();

  const className = result.className;
  t.true(className.indexOf('root_properties_association') !== -1);
  t.true(className.indexOf('control-TEST') !== -1);
  t.is(result.childNodes.length, 3);
  const label = result.children[0] as HTMLLabelElement;
  t.true(label.className.indexOf('label-TEST') !== -1);
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, 'Association');
  const input = result.children[1] as HTMLSelectElement;

  // Check combo box
  t.true(input.className.indexOf('input-TEST') !== -1);
  t.is(input.tagName, 'SELECT');
  t.is(input.children.length, 3);
  t.is(input.selectedIndex, 2);
  const defaultOption = input.children[0] as HTMLOptionElement;
  const option1 = input.children[1] as HTMLOptionElement;
  const option2 = input.children[2] as HTMLOptionElement;
  t.is(defaultOption.tagName, 'OPTION');
  t.is(option1.tagName, 'OPTION');
  t.is(option2.tagName, 'OPTION');
  t.is(option1.value, 'c1');
  t.is(option2.value, 'c2');
  t.is(defaultOption.innerText, 'Choose Reference Target...');
  t.is(option1.innerText, 'CL1');
  t.is(option2.innerText, 'CL2');
  t.true(defaultOption.disabled);
  t.true(defaultOption.hidden);
  // commented out because JsDom does not properly support the option's label property
  // t.is(option1.label, 'CL1');
  // t.is(option2.label, 'CL2');

  const validation = result.children[2];
  t.true(validation.className.indexOf('validation-TEST') !== -1);
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);

  /* tslint:disable:no-string-literal */
  t.is(data.classes[1]['association'], 'c2');
  /* tslint:enable:no-string-literal */
});

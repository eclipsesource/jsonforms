import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { JsonForms } from '../../src/core';
import { DataService } from '../../src/core/data.service';
import { SchemaService } from '../../src/core/schema.service';
import { SchemaServiceImpl } from '../../src/core/schema.service.impl';
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

test('Abstract Reference Control - render all options', t => {
  customElements.define('test-renderer', ReferenceControlTestImpl);
  const schema: JsonSchema = t.context.schema;
  const data = {classes: [{id: 'c1', name: 'CL1'}, {id: 'c2', name: 'CL2', association: 'c1'}]};
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
  const input = result.children[1] as HTMLInputElement;

  // Check combo box
  t.true(input.className.indexOf('input-TEST') !== -1);
  t.is(input.tagName, 'SELECT');
  t.is(input.children.length, 2);
  const option1 = input.children[0] as HTMLOptionElement;
  const option2 = input.children[1] as HTMLOptionElement;
  t.is(option1.tagName, 'OPTION');
  t.is(option2.tagName, 'OPTION');
  t.is(option1.value, 'c1');
  t.is(option2.value, 'c2');
  t.is(option1.innerText, 'CL1');
  t.is(option2.innerText, 'CL2');
  // commented out because JsDom does not properly support the option's label property
  // t.is(option1.label, 'CL1');
  // t.is(option2.label, 'CL2');

  const validation = result.children[2];
  t.true(validation.className.indexOf('validation-TEST') !== -1);
  t.is(validation.tagName, 'DIV');
  t.is(validation.children.length, 0);
});

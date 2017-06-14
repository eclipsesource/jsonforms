import {registerExamples} from '../example';
import {JsonForms} from '../../src/core';
import {Renderer} from '../../src/core/renderer';
import {JsonFormsElement} from '../../src/json-forms';
import { resolveSchema } from '../../src/path.util';
import { UISchemaElement, ControlElement } from '../../src/models/uischema';
import { JsonSchema } from '../../src/models/jsonSchema';

const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'done': {
      'type': 'boolean'
    },
    'due_date': {
      'type': 'string',
      'format': 'date'
    },
    'rating': {
      'type': 'integer',
      'maximum': 5
    },
    'recurrence': {
        'type': 'string',
        'enum': ['Never', 'Daily', 'Weekly', 'Monthly']
    },
    'recurrence_interval': {
        'type': 'integer'
    }
  },
  'required': ['name']
};
const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'label': false,
      'scope': {
        '$ref': '#/properties/done'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/name'
      }
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/due_date'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/rating'
          }
        }
      ]
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/description'
      },
      'options': {
          'multi': true
      }
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/recurrence'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/recurrence_interval'
          },
          'rule': {
              'effect': 'HIDE',
              'condition': {
                  'scope': {
                      '$ref': '#/properties/recurrence'
                  },
                  'expectedValue': 'Never'
              }
          }
        }
      ]
    }
  ]
};
const data =  {
  'name': 'Send email to Adriana',
  'description': 'Confirm if you have passed the subject\nHerby ...',
  'done': true,
  'recurrence': 'Daily'
};

const resetServices = () => {
  const jsonforms = <JsonFormsElement>document.getElementsByTagName('json-forms')[0];
  jsonforms.data = data;
};

const tester = (my_uischema: UISchemaElement, my_schema: JsonSchema) =>
  my_uischema.type === 'Control'
  && resolveSchema(my_schema, (<ControlElement>my_uischema).scope.$ref).type === 'integer' ? 5 : -1;

class MyControl extends Renderer {
  render(): HTMLElement {
    const controlElement = <ControlElement>this.uischema;
    for (let i = 1; i <= 5; i++) {
      const span = document.createElement('span');
      span.innerText = '\u2606';
      span.onclick = () => {
        this.dataService.notifyAboutDataChange(controlElement, i);
        this.updateSpans(span);
      };
      span.onmouseover = () => {
        this.updateSpans(span);
      };
      span.style.cursor = 'default';
      this.appendChild(span);
    }
    this.className = 'rating';
    this.onmouseout = () => {
      this.setCurrent();
    };
    this.setCurrent();
    return this;
  }
  dispose(): void {
    return;
  }
  private setCurrent(): void {
    const currentValue = this.dataService.getValue(<ControlElement>this.uischema);
    for (let i = 1; i <= 5; i++) {
      let star = '\u2605';
      if (i > currentValue || currentValue === undefined) {
        star = '\u2606';
      }
      (<HTMLSpanElement>this.children.item(i - 1)).innerText = star;
    }
  }
  private updateSpans(span: HTMLSpanElement): void {
    span.innerText = '\u2605';
    let prevStar = <HTMLSpanElement>span.previousElementSibling;
    while (prevStar !== null) {
      prevStar.innerText = '\u2605';
      prevStar = <HTMLSpanElement>prevStar.previousElementSibling;
    }
    let nextStar = <HTMLSpanElement>span.nextElementSibling;
    while (nextStar !== null) {
      nextStar.innerText = '\u2606';
      nextStar = <HTMLSpanElement>nextStar.nextElementSibling;
    }
  }

}
customElements.define('my-control', MyControl);

const setup = (div: HTMLDivElement) => {
  const buttonRegister = document.createElement('button');
  buttonRegister.innerText = 'Register Custom Control';
  buttonRegister.onclick = () => {
    JsonFormsElement.rendererService.registerRenderer(tester, 'my-control');
    // HACK to retrigger service creation
    resetServices();
  };
  div.appendChild(buttonRegister);
  const buttonUnregister = document.createElement('button');
  buttonUnregister.innerText = 'Unregister Custom Control';
  buttonUnregister.onclick = () => {
    JsonFormsElement.rendererService.deregisterRenderer(tester, 'my-control');
    // HACK to retrigger service creation
    resetServices();
  };
  div.appendChild(buttonUnregister);
};
registerExamples([
  {name: 'day6', label: 'Day 6', data: data,
    schema: schema, uiSchema: uischema, setupCallback: setup}
]);

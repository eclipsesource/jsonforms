import { JsonForms, JsonFormService } from '../../src/core';
import { JsonFormsElement } from '../../src/json-forms';
import { JsonSchema } from '../../src/models/jsonSchema';
import { UISchemaElement } from '../../src/models/uischema';

import { registerExamples } from '../example';

class MyService implements JsonFormService {
  constructor(dataSchema: JsonSchema, uiSchema: UISchemaElement) {
    this.createButton();
  }
  dispose(): void {
    return;
  }
  private createButton(): void {
    const button = document.createElement('button');
    button.innerText = 'Change data';
    button.onclick = () => {
      // this.dataService.notifyAboutDataChange(
      //     {
      //       scope: {
      //         $ref: '#/properties/name'
      //       }
      //     },
      //     'blub'
      // );
    };
    const div = document.getElementById('dynamic2-example');
    div.appendChild(button);
  }
}

const resetServices = () => {
  const jsonforms = document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
  jsonforms.data = {name: 'bla'};
};

const setup = (div: HTMLDivElement) => {
  const dynamic2ExampleDiv = document.createElement('div');
  dynamic2ExampleDiv.id = 'dynamic2-example';

  const buttonRegister = document.createElement('button');
  buttonRegister.innerText = 'Register Service';
  buttonRegister.onclick = () => {
    // JsonForms.jsonFormsServices.push(MyService);
    resetServices();
  };
  div.appendChild(buttonRegister);
  const buttonUnregister = document.createElement('button');
  buttonUnregister.innerText = 'Unregister Service';
  buttonUnregister.onclick = () => {
    const index = -1; // JsonForms.jsonFormsServices.indexOf(MyService);
    if (index === -1) {
      return;
    }
    JsonForms.jsonFormsServices.splice(index, 1);
    // HACK to retrigger service creation
    resetServices();
    dynamic2ExampleDiv.removeChild(dynamic2ExampleDiv.firstChild);
  };
  div.appendChild(buttonUnregister);

  div.appendChild(dynamic2ExampleDiv);
};

registerExamples([
  {name: 'dynamic2', label: 'Dynamic DataChange', schema: undefined,
  uiSchema: undefined, data: {name: 'bla'}, setupCallback: setup}
]);

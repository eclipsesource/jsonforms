import { JsonFormService, JsonForms} from '../../src/core';
import {DataService} from '../../src/core/data.service';
import { JsonSchema } from '../../src/models/jsonSchema';
import { UISchemaElement, ControlElement, Layout } from '../../src/models/uischema';
import {JsonFormsElement} from '../../src/json-forms';

import {registerExamples} from '../example';

class MyService implements JsonFormService {
  constructor(private dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement) {
    this.createButton();
  }
  dispose(): void {
    return;
  }
  private createButton(): void {
    const button = document.createElement('button');
    button.innerText = 'Change data';
    button.onclick = () => {
      this.dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/name'}}, 'blub');
    };
    const div = document.getElementById('dynamic2-example');
    div.appendChild(button);
  }
}

const resetServices = () => {
  const jsonforms = <JsonFormsElement>document.getElementsByTagName('json-forms')[0];
  jsonforms.data = {name: 'bla'};
};

const setup = (div: HTMLDivElement) => {
  const dynamic2_example_div = document.createElement('div');
  dynamic2_example_div.id = 'dynamic2-example';

  const buttonRegister = document.createElement('button');
  buttonRegister.innerText = 'Register Service';
  buttonRegister.onclick = () => {
    JsonFormsElement.jsonFormsServices.push(MyService);
    resetServices();
  };
  div.appendChild(buttonRegister);
  const buttonUnregister = document.createElement('button');
  buttonUnregister.innerText = 'Unregister Service';
  buttonUnregister.onclick = () => {
    const index = JsonFormsElement.jsonFormsServices.indexOf(MyService);
    if (index === -1) {
      return;
    }
    JsonFormsElement.jsonFormsServices.splice(index, 1);
    // HACK to retrigger service creation
    resetServices();
    dynamic2_example_div.removeChild(dynamic2_example_div.firstChild);
  };
  div.appendChild(buttonUnregister);

  div.appendChild(dynamic2_example_div);
};

registerExamples([
  {name: 'dynamic2', label: 'Dynamic DataChange', schema: undefined,
  uiSchema: undefined, data: {name: 'bla'}, setupCallback: setup}
]);

import * as _ from 'lodash';
import { ControlElement } from '../../models/uischema';
import { JsonForms } from '../../json-forms';
import { Renderer } from '../../core/renderer';
import { DataChangeListener} from '../../core/data.service';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';
import { JsonSchema } from '../../models/jsonSchema';
import { getElementLabelObject } from '../label.util';
import { RankedTester, rankWith, and, uiTypeIs, schemaMatches } from '../../core/testers';
import { JsonFormsHolder } from '../../core';
import {isItemModel, ITEM_MODEL_TYPES} from '../../parser/item_model';

export const arrayTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(model =>
        isItemModel(model) ?
        !_.isEmpty(model.schema)
        && model.type === ITEM_MODEL_TYPES.ARRAY // 'array'
        && !Array.isArray(model.schema) // we don't care about tuples
        && model.schema.type === 'object' : false
    ))
);
@JsonFormsRenderer({
  selector: 'jsonforms-array',
  tester: arrayTester
})
export class ArrayControlRenderer extends Renderer implements DataChangeListener {

  constructor() {
    super();
  }

  isRelevantKey (uischema: ControlElement): boolean {
    return uischema === undefined || uischema === null
    ? false : (<ControlElement>this.uischema).scope.$ref === uischema.scope.$ref;
  }

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.dataService.registerChangeListener(this);
  }
  disconnectedCallback(): void {
    this.dataService.unregisterChangeListener(this);
    super.disconnectedCallback();
  }
  dispose(): void {
    // do nothing
  }

  render(): HTMLElement {
    this.classList.add('control');
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const div = document.createElement('fieldset');
    div.className = 'array-layout';

    const header = document.createElement('legend');
    div.appendChild(header);
    const label = document.createElement('label');
    const labelObject = getElementLabelObject(this.dataModel, controlElement);
    if (labelObject.show) {
      label.textContent = labelObject.text;
    }
    header.appendChild(label);

    const content = document.createElement('div');
    content.classList.add('children');
    let arrayData = this.dataService.getValue(controlElement);

    const renderChild = (element: Object): void => {
      const jsonForms = <JsonForms>document.createElement('json-forms');
      const resolvedSchema = resolveSchema(this.dataModel, controlElement.scope.$ref); // + '/items'
      jsonForms.data = element;
      jsonForms.dataModel = resolvedSchema;
      content.appendChild(jsonForms);
    };

    if (arrayData !== undefined) {
      arrayData.forEach(element => renderChild(element));
    }
    div.appendChild(content);

    const button = document.createElement('button');
    button.className = JsonFormsHolder.stylingRegistry.getAsClassName('button');
    button.textContent = `Add to ${labelObject.text}`;
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      const element = {};
      arrayData.push(element);
      renderChild(element);
      this.dataService.notifyChange(controlElement, arrayData);
    };

    header.appendChild(button);
    this.appendChild(div);
    return this;
  }
}

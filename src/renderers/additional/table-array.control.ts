import * as _ from 'lodash';
import { ControlElement } from '../../models/uischema';
import { JsonSchema } from '../../models/jsonSchema';
import { JsonForms } from '../../json-forms';
import { Renderer } from '../../core/renderer';
import { DataChangeListener} from '../../core/data.service';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';
import { getElementLabelObject } from '../label.util';
import { rankWith, uiTypeIs, optionIs, and, schemaMatches, RankedTester } from '../../core/testers';
import {isItemModel, ITEM_MODEL_TYPES, ItemModel} from '../../parser/item_model';

export const tableArrayTester: RankedTester = rankWith(10, and(
    uiTypeIs('Control'),
    optionIs('table', true),
    schemaMatches(model =>
        isItemModel(model) ?
        !_.isEmpty(model.schema)
        && model.type === ITEM_MODEL_TYPES.ARRAY // && model.schema.type === 'array'
        && !Array.isArray(model.schema) // we don't care about tuples
        && model.schema.type === 'object' : false
    ))
);
@JsonFormsRenderer({
  selector: 'jsonforms-tablearray',
  tester: tableArrayTester
})
export class TableArrayControlRenderer extends Renderer implements DataChangeListener {

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
    // no-op
  }

  render(): HTMLElement {

    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const div = document.createElement('div');
    div.classList.add('array-table-layout');
    div.classList.add('control');

    const header = document.createElement('header');
    div.appendChild(header);
    const label = document.createElement('label');
    const labelObject = getElementLabelObject(this.dataModel, controlElement);
    if (labelObject.show) {
      label.textContent = labelObject.text;
    }
    header.appendChild(label);

    const content = document.createElement('table');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    const resolvedSchema = <ItemModel>resolveSchema(this.dataModel, controlElement.scope.$ref);
    Object.keys(resolvedSchema.attributes).forEach(key => {
      // if (resolvedSchema.properties[key].type === 'array') {
      //   return;
      // }
      const headColumn = document.createElement('th');
      headColumn.innerText = key;
      headRow.appendChild(headColumn);
    });
    head.appendChild(headRow);
    content.appendChild(head);
    const body = document.createElement('tbody');
    let arrayData = this.dataService.getValue(controlElement);
    const renderChild = (element: Object): void => {
      const row = document.createElement('tr');
      Object.keys(resolvedSchema.attributes).forEach(key => {
        // if (resolvedSchema.properties[key].type === 'array') {
        //   return;
        // }
        const column = document.createElement('td');
        const jsonForms = <JsonForms>document.createElement('json-forms');
        jsonForms.data = element;
        jsonForms.uiSchema = {
          type: 'Control',
          label: false,
          scope: {$ref: `#/properties/${key}`}
        } as ControlElement;
        jsonForms.dataModel = resolvedSchema;
        column.appendChild(jsonForms);
        row.appendChild(column);
      });
      body.appendChild(row);
    };
    content.appendChild(body);
    if (arrayData !== undefined) {
      arrayData.forEach(element => renderChild(element));
    }
    div.appendChild(content);

    const button = document.createElement('button');
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

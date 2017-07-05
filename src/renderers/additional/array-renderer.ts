import * as _ from 'lodash';
import {JsonForms} from '../../core';
import {DataChangeListener} from '../../core/data.service';
import {Renderer} from '../../core/renderer';
import {
  and,
  RankedTester,
  rankWith,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs
} from '../../core/testers';
import {JsonFormsElement} from '../../json-forms';
import {ControlElement} from '../../models/uischema';
import {resolveSchema} from '../../path.util';
import {getElementLabelObject} from '../label.util';
import {JsonFormsRenderer} from '../renderer.util';
/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
export const arrayTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(schema =>
        !_.isEmpty(schema)
        && schema.type === 'array'
        && !_.isEmpty(schema.items)
        && !Array.isArray(schema.items) // we don't care about tuples
    ),
    schemaSubPathMatches('items', schema =>
        schema.type === 'object'
    ))
);

/**
 * Default renderer for an array.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-array',
  tester: arrayTester
})
export class ArrayControlRenderer extends Renderer implements DataChangeListener {

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  needsNotificationAbout (controlElement: ControlElement): boolean {
    return controlElement === undefined || controlElement === null
    ? false : (this.uischema as ControlElement).scope.$ref === controlElement.scope.$ref;
  }

  /**
   * @inheritDoc
   */
  dataChanged(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }

  /**
   * @inheritDoc
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.dataService.registerDataChangeListener(this);
  }

  /**
   * @inheritDoc
   */
  disconnectedCallback(): void {
    this.dataService.deregisterDataChangeListener(this);
    super.disconnectedCallback();
  }

  /**
   * @inheritDoc
   */
  dispose(): void {
    // do nothing
  }

  /**
   * @inheritDoc
   */
  render(): HTMLElement {
    this.classList.add('control');
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = this.uischema as ControlElement;
    const div = document.createElement('fieldset');
    div.className = 'array-layout';

    const header = document.createElement('legend');
    div.appendChild(header);
    const label = document.createElement('label');
    const labelObject = getElementLabelObject(this.dataSchema, controlElement);
    if (labelObject.show) {
      label.textContent = labelObject.text;
    }
    header.appendChild(label);

    const content = document.createElement('div');
    content.classList.add('children');
    let arrayData = this.dataService.getValue(controlElement);

    const renderChild = (element: Object): void => {
      const jsonForms = document.createElement('json-forms') as JsonFormsElement;
      const resolvedSchema = resolveSchema(this.dataSchema, controlElement.scope.$ref + '/items');
      jsonForms.data = element;
      jsonForms.dataSchema = resolvedSchema;
      content.appendChild(jsonForms);
    };

    if (arrayData !== undefined) {
      arrayData.forEach(element => {
        renderChild(element);
      });
    }
    div.appendChild(content);

    const button = document.createElement('button');
    button.className = JsonForms.stylingRegistry.getAsClassName('button');
    button.textContent = `Add to ${labelObject.text}`;
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      const element = {};
      arrayData.push(element);
      renderChild(element);
      this.dataService.notifyAboutDataChange(controlElement, arrayData);
    };

    header.appendChild(button);
    this.appendChild(div);

    return this;
  }
}

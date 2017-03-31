import { ControlElement } from '../../models/uischema';
import {Renderer} from '../../core/renderer';
import {DataChangeListener} from '../../core/data.service';
import {getElementLabelObject} from '../label.util';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';

export abstract class BaseControl <T extends HTMLElement>
  extends Renderer implements DataChangeListener {

  private label: HTMLLabelElement;
  private input: T;
  private errorElement: HTMLElement;

  private static formatErrorMessage(errors: Array<string>) {
    if (errors === undefined) {
      return '';
    }
    return errors.join('\n');
  }

  constructor() {
    super();
  }

  render(): HTMLElement {
    const controlElement = <ControlElement> this.uischema;
    this.createLabel(controlElement);
    this.createInput(controlElement);
    this.input.classList.add('input');
    this.errorElement = document.createElement('div');
    this.errorElement.classList.add('validation');
    this.appendChild(this.label);
    this.appendChild(this.input);
    this.appendChild(this.errorElement);
    this.classList.add('control');
    return this;
  }
  dispose(): void {
    // Do nothing
  }
  notify(type: RUNTIME_TYPE): void {
    const runtime = <Runtime>this.uischema['runtime'];
    switch (type) {
      case RUNTIME_TYPE.VALIDATION_ERROR:
        this.errorElement.textContent = BaseControl.formatErrorMessage(runtime.validationErrors);
        this.classList.toggle('validation_error', runtime.validationErrors !== undefined);
        break;
      case RUNTIME_TYPE.VISIBLE:
        this.hidden = !runtime.visible;
        break;
      case RUNTIME_TYPE.ENABLED:
        if (!runtime.enabled) {
          this.input.setAttribute('disabled', 'true');
        } else {
          this.input.removeAttribute('disabled');
        }
        break;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.dataService.registerChangeListener(this);
  }
  disconnectedCallback(): void {
    this.dataService.unregisterChangeListener(this);
    super.disconnectedCallback();
  }

  isRelevantKey (uischema: ControlElement): boolean {
    if (uischema === null) {
      return false;
    }
    return (<ControlElement>this.uischema).scope.$ref === uischema.scope.$ref;
  }

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.setValue(this.input, newValue);
  }

  protected convertModelValue(value: any): any {
    return value;
  }

  protected convertInputValue(value: any): any {
    return value;
  }

  protected abstract get inputChangeProperty(): string;
  protected abstract configureInput(input: T): void;
  protected abstract get valueProperty(): string;
  protected abstract get inputElement(): T;

  private createLabel(controlElement: ControlElement): void {
    this.label = document.createElement('label');
    const labelObject = getElementLabelObject(this.dataSchema, controlElement);
    if (labelObject.show) {
      this.label.textContent = labelObject.text;
    }
  }

  private createInput(controlElement: ControlElement): void {
    this.input = this.inputElement;
    this.configureInput(this.input);
    this.input[this.inputChangeProperty] = ((ev: Event) =>
            this.dataService.notifyChange(controlElement, this.getValue(this.input))
    );
    this.setValue(this.input, this.dataService.getValue(controlElement));
  }

  private getValue(input: T): any {
    return this.convertInputValue(input[this.valueProperty]);
  }

  private setValue(input: T, value: any): void {
    input[this.valueProperty] = this.convertModelValue(value);
  }
}

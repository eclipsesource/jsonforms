import {ControlElement} from "../../models/uischema";
import {Renderer, Runtime, RUNTIME_TYPE, DataChangeListener } from "../../core";
export abstract class BaseControl <T extends HTMLElement> extends Renderer implements DataChangeListener {
  private label: HTMLLabelElement;
  private input: T;
  private errorElement: HTMLElement;
  constructor() {
    super();
  }
  connectedCallback() {
    let controlElement = <ControlElement> this.uischema;
    this.createLabel(controlElement);
    this.createInput(controlElement);
    this.createError();
    this.appendChild(this.label);
    this.appendChild(this.input);
    this.appendChild(this.errorElement);
  }

  notify(type: RUNTIME_TYPE): void {
    let runtime = <Runtime>this.uischema["runtime"];
    switch (type) {
      case RUNTIME_TYPE.VALIDATION_ERROR: this.errorElement.textContent = this.getErrorMessage(runtime.validationErrors); break;
    }
  }
  private getErrorMessage(errors: Array<string>) {
    if (errors === undefined) {
      return "";
    }
    return errors.reduce((previousValue: string, currentValue: string, index: number) => previousValue.concat(currentValue + (index === 0 ? "" : "\n")), "");
  }
  isRelevantKey(uischema: ControlElement): boolean {
    return this.uischema === uischema;
  }
  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.setValue(this.input, newValue);
  }

  private createLabel(controlElement: ControlElement): void {
    this.label = document.createElement("label");
    this.label.textContent = controlElement.label;
  }
  private createInput(controlElement: ControlElement): void {
    this.input = this.inputElement;
    this.configureInput(this.input);
    this.input[this.inputChangeProperty] = ((ev: Event) => {
      this.dataService.notifyChange(controlElement, this.getValue(this.input));
    });
    this.setValue(this.input, this.dataService.getValue(controlElement));
  }
  private createError(): void {
    this.errorElement = document.createElement("div");
  }
  private getValue(input: T): any {
    return this.convertInputValue(input[this.valueProperty]);
  }
  private setValue(input: T, value: any): void {
    input[this.valueProperty] = this.convertModelValue(value);
  }
  protected abstract get inputChangeProperty(): string;
  protected abstract configureInput(input: T): void;
  protected abstract get valueProperty(): string;
  protected abstract get inputElement(): T;
  protected convertModelValue(value: any): any {
    return value;
  }
  protected convertInputValue(value: any): any {
    return value;
  }
}

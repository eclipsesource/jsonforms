import {UISchemaElement, ControlElement} from "../../models/uischema";
import {BaseControl} from "./base.control";
import {JsonFormsRenderer} from "../renderer.util";

@JsonFormsRenderer({
  selector: "jsonforms-text",
  tester: (uischema: UISchemaElement) => uischema.type === "Control" ? 1 : -1
})
class TextControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = "text";
  }
  protected get valueProperty(): string {
    return "value";
  }
  protected get inputChangeProperty(): string {
    return "oninput";
  }
  protected convertModelValue(value: any): any {
    return value === undefined ? "" : value;
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement("input");
  }
}

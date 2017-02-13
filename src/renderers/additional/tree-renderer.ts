import {UISchemaElement, ControlElement, VerticalLayout} from "../../models/uischema";
import {JsonForms} from "../../json-forms";
import { Renderer, DataChangeListener, DataService, JsonFormsHolder } from "../../core";
import {JsonFormsRenderer} from "../renderer.util";

@JsonFormsRenderer({
  selector: "jsonforms-tree",
  tester: (uischema: UISchemaElement) => uischema.type === "TreeControl" ? 1 : -1
})
class TreeRenderer extends Renderer implements DataChangeListener {
  private master: HTMLElement;
  private detail: HTMLElement;
  constructor() {
    super();
  }

  connectedCallback() {
    let controlElement = <ControlElement> this.uischema;

    let div = document.createElement("div");
    div.className = "tree-layout";

    let label = document.createElement("label");
    label.textContent = controlElement.label;
    this.appendChild(label);
    let button = document.createElement("button");
    button.textContent = "Add me";

    let arrayData = this.dataService.getValue(controlElement);
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      arrayData.push({});
      this.dataService.notifyChange(controlElement, arrayData);
    };
    this.appendChild(button);

    this.master = document.createElement("div");
    this.master.className = "tree-master";
    div.appendChild(this.master);

    this.detail = document.createElement("div");
    this.detail.className = "tree-detail";
    div.appendChild(this.detail);

    this.appendChild(div);
    this.render();
    this.dataService.registerChangeListener(this);

  }
  private render() {
    this.renderMaster();
    let controlElement = <ControlElement> this.uischema;
    let arrayData = this.dataService.getValue(controlElement);
    if (arrayData !== undefined && arrayData.length !== 0) {
      this.renderDetail(arrayData[0], this.master.lastChild.firstChild);
    }
  }
  private renderMaster() {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    let controlElement = <ControlElement> this.uischema;
    let arrayData = this.dataService.getValue(controlElement);
    if (arrayData !== undefined) {
      let ul = document.createElement("ul");
      arrayData.forEach(element => {
        let li = document.createElement("li");
        li.onclick = (ev: Event) => {this.renderDetail(element, li); };
        li.textContent = element[Object.keys(element)[0]];
        ul.appendChild(li);
      });
      this.master.appendChild(ul);
    }
  }
  private renderDetail(element, li) {
    if (this.detail.lastChild !== null) {
      this.detail.removeChild(this.detail.lastChild);
    }
    let innerUiSchema = <VerticalLayout>{
      "type": "VerticalLayout",
      "elements": [
        <ControlElement>{
          "type": "Control",
          "label": "Name",
          "scope": {
            "$ref": "#/properties/name"
          }
        }
      ]
    };
    let innerDataSchema = {"type": "object",  "properties": {"name": {"type" : "string", "minLength": 5}}};
    let innerDataService = new DataService(element);
    innerDataService.registerChangeListener({
      isRelevantKey(uischema: ControlElement): boolean {
        return true;
      },
      notifyChange(uischema: ControlElement, newValue: any, data: any): void {
        let text = element[Object.keys(element)[0]];
        if (text === undefined) {
          text = "";
        }
        li.textContent = text;
      }
    });
    let lastRenderer = JsonFormsHolder.rendererService.getBestRenderer(innerUiSchema, innerDataSchema, innerDataService);
    this.detail.appendChild(lastRenderer);
  }
  isRelevantKey(uischema: ControlElement): boolean {
    return this.uischema === uischema;
  }
  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }
}

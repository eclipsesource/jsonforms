import {UISchemaElement, ControlElement, Layout} from "../models/uischema";
import {JsonFormsServiceElement, JsonFormService, DataChangeListener, DataService, Runtime } from "../core";
import {JsonSchema} from "../models/jsonSchema";
import {PathUtil} from "../path.util";

import * as AJV from "ajv";

@JsonFormsServiceElement({})
class JsonFormsValidator implements DataChangeListener, JsonFormService {
  private validator: AJV.ValidateFunction;
  private pathToControlMap: {[path: string]: ControlElement} = {};
  constructor(private dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement) {
    dataService.registerChangeListener(this);
    let ajv = new AJV({allErrors: true, jsonPointers: true, errorDataPath: "property"});
    this.validator = ajv.compile(dataSchema);
    this.parseUiSchema(uiSchema);
  }
  private  parseUiSchema(uiSchema: UISchemaElement): void {
    if (uiSchema.hasOwnProperty("elements")) {
      (<Layout>uiSchema).elements.forEach(element => this.parseUiSchema(element));
    }
    else if (uiSchema.hasOwnProperty("scope")) {
      let control = <ControlElement> uiSchema;
      this.pathToControlMap[PathUtil.toDataPath(control.scope.$ref)] = control;
    }
  }
  isRelevantKey(uischema: ControlElement): boolean {
    return true;
  }
  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.validate(data);
  }
  private validate(data: any) {
    this.cleanAllValidationErrors();
    let valid = this.validator(data);
    if (valid) {
      return null;
    }
    let errors = this.validator.errors;
    errors.forEach(error => this.mapErrorToControl(error));
  }
  private mapErrorToControl(error: AJV.ErrorObject): void {
    let uiSchema = this.pathToControlMap[error.dataPath.substring(1)];
    if (!uiSchema.hasOwnProperty("runtime")) {
      let runtime = new Runtime();
      uiSchema["runtime"] = runtime;
    }
    let runtime = <Runtime> uiSchema["runtime"];
    if (runtime.validationErrors === undefined) {
      runtime.validationErrors = [];
    }
    runtime.validationErrors = runtime.validationErrors.concat(error.message);
  }
  private cleanAllValidationErrors(): void {
    Object.keys(this.pathToControlMap).forEach(key => {
      if (!this.pathToControlMap[key].hasOwnProperty("runtime")) {
        return;
      }
      (<Runtime> this.pathToControlMap[key]["runtime"]).validationErrors = undefined;
    });
  }
  dispose(): void {
    this.dataService.unregisterChangeListener(this);
  }
}

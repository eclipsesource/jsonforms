import { UISchemaElement, ControlElement, Layout } from '../models/uischema';
import { JsonFormsServiceElement, JsonFormService, DataChangeListener, DataService,
  Runtime } from '../core';
import { JsonSchema } from '../models/jsonSchema';
import { toDataPath } from '../path.util';

import * as AJV from 'ajv';

@JsonFormsServiceElement({})
class JsonFormsValidator implements DataChangeListener, JsonFormService {

  private validator: AJV.ValidateFunction;
  private pathToControlMap: {[path: string]: ControlElement} = {};

  constructor(private dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement) {
    dataService.registerChangeListener(this);
    const ajv = new AJV({allErrors: true, jsonPointers: true, errorDataPath: 'property'});
    this.validator = ajv.compile(dataSchema);
    this.parseUiSchema(uiSchema);
  }

  isRelevantKey = (_: ControlElement): boolean => true;

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.validate(data);
  }

  dispose(): void {
    this.dataService.unregisterChangeListener(this);
  }

  private  parseUiSchema(uiSchema: UISchemaElement): void {
    if (uiSchema.hasOwnProperty('elements')) {
      (<Layout>uiSchema).elements.forEach(element => this.parseUiSchema(element));
    } else if (uiSchema.hasOwnProperty('scope')) {
      const control = <ControlElement> uiSchema;
      this.pathToControlMap[toDataPath(control.scope.$ref)] = control;
    }
  }

  private validate(data: any) {
    this.cleanAllValidationErrors();
    const valid = this.validator(data);
    if (valid) {
      return null;
    }
    const errors = this.validator.errors;
    errors.forEach(error => this.mapErrorToControl(error));
  }

  private mapErrorToControl(error: AJV.ErrorObject): void {
    const uiSchema = this.pathToControlMap[error.dataPath.substring(1)];
    if (!uiSchema.hasOwnProperty('runtime')) {
      uiSchema['runtime'] = new Runtime();
    }
    const runtime = <Runtime> uiSchema['runtime'];
    if (runtime.validationErrors === undefined) {
      runtime.validationErrors = [];
    }
    runtime.validationErrors = runtime.validationErrors.concat(error.message);
  }

  private cleanAllValidationErrors(): void {
    Object.keys(this.pathToControlMap).forEach(key => {
      if (!this.pathToControlMap[key].hasOwnProperty('runtime')) {
        return;
      }
      (<Runtime> this.pathToControlMap[key]['runtime']).validationErrors = undefined;
    });
  }
}

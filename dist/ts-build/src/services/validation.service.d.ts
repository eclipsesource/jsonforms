import { UISchemaElement, ControlElement } from '../models/uischema';
import { JsonFormService } from '../core';
import { JsonSchema } from '../models/jsonSchema';
import { DataService, DataChangeListener } from '../core/data.service';
export declare class JsonFormsValidator implements DataChangeListener, JsonFormService {
    private dataService;
    private validator;
    private pathToControlMap;
    constructor(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement);
    isRelevantKey(_: ControlElement): boolean;
    notifyChange(uischema: ControlElement, newValue: any, data: any): void;
    dispose(): void;
    private parseUiSchema(uiSchema);
    private validate(data);
    private mapErrorToControl(error);
    private cleanAllValidationErrors();
}

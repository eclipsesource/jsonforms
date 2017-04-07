import { UISchemaElement, ControlElement } from '../models/uischema';
import { JsonFormService } from '../core';
import { JsonSchema } from '../models/jsonSchema';
import { DataService, DataChangeListener } from '../core/data.service';
export declare class JsonFormsRuleService implements DataChangeListener, JsonFormService {
    private dataService;
    private pathToControlMap;
    constructor(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement);
    isRelevantKey(uischema: ControlElement): boolean;
    notifyChange(uischema: ControlElement, newValue: any, data: any): void;
    dispose(): void;
    private parseRules(uiSchema);
    private evaluate(uiSchema, data);
    private initialRun(data);
}

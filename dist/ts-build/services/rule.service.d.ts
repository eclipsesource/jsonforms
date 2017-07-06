import { JsonFormService } from '../core';
import { DataChangeListener, DataService } from '../core/data.service';
import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
/**
 * Service that evaluates all rules upon a data change.
 */
export declare class JsonFormsRuleService implements DataChangeListener, JsonFormService {
    private dataService;
    private pathToControlMap;
    /**
     * Constructor.
     *
     * @param {DataService} dataService the data service
     * @param {JsonSchema} dataSchema the JSON schema describing the data
     * @param {UISchemaElement} uiSchema the UI schema to be rendered
     */
    constructor(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement);
    /**
     * @inheritDoc
     */
    needsNotificationAbout(uischema: ControlElement): boolean;
    /**
     * @inheritDoc
     */
    dataChanged(uischema: ControlElement, newValue: any, data: any): void;
    /**
     * @inheritDoc
     */
    dispose(): void;
    private parseRules(uiSchema);
    private evaluate(uiSchema, data);
    private initialRun;
}

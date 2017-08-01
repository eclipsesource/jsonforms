import { JsonFormService } from '../core';
import { DataChangeListener, DataService } from '../core/data.service';
import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
/**
 * Validator service based on ajv.
 */
export declare class JsonFormsValidator implements DataChangeListener, JsonFormService {
    private dataService;
    private validator;
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
    needsNotificationAbout(_: ControlElement): boolean;
    /**
     * @inheritDoc
     */
    dataChanged: (uischema: ControlElement, newValue: any, data: any) => void;
    /**
     * @inheritDoc
     */
    dispose: () => void;
    private parseUiSchema(uiSchema);
    private validate(data);
    private mapErrorToControl(error);
    private cleanAllValidationErrors();
}

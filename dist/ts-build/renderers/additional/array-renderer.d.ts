import { UISchemaElement, ControlElement } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { DataChangeListener } from '../../core/data.service';
import { JsonSchema } from '../../models/jsonSchema';
export declare const ArrayControlTester: (uischema: UISchemaElement, schema: JsonSchema) => 2 | -1;
export declare class ArrayControlRenderer extends Renderer implements DataChangeListener {
    constructor();
    isRelevantKey(uischema: ControlElement): boolean;
    notifyChange(uischema: ControlElement, newValue: any, data: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispose(): void;
    render(): HTMLElement;
}

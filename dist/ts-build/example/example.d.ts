import { JsonSchema } from '../src/models/jsonSchema';
import { UISchemaElement } from '../src/models/uischema';
export interface ExampleDescription {
    name: string;
    label: string;
    data: any;
    schema: JsonSchema;
    uiSchema: UISchemaElement;
    setupCallback?(div: HTMLDivElement): void;
}
export declare const registerExamples: (examples: ExampleDescription[]) => void;
export declare const changeExample: (selectedExample: string) => void;
export declare const createExampleSelection: () => HTMLSelectElement;

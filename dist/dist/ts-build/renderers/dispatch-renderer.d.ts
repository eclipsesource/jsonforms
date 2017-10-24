import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import { RankedTester } from '../core/testers';
export interface DispatchRendererProps {
    /**
     * The UI schema to be rendered.
     */
    uischema: UISchemaElement;
    /**
     * The JSON schema that describes the data.
     */
    schema: JsonSchema;
    renderers: {
        tester: RankedTester;
        renderer: any;
    }[];
    /**
     * Optional instance path. Necessary when the actual data
     * path can not be inferred via the UI schema element as
     * it is the case with nested controls.
     */
    path?: string;
}
export declare const DispatchRenderer: (props: DispatchRendererProps) => any;
export declare const JsonFormsRenderer: (props: DispatchRendererProps) => any;
export default JsonFormsRenderer;

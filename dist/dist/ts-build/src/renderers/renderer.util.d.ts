import { Renderer, RendererProps } from '../core/renderer';
import { RankedTester } from '../core/testers';
import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
/**
 * A renderer config that is used during renderer registration.
 */
export interface JsonFormsRendererConfig {
    /**
     * The tester that that determines how applicable
     * the renderer is.
     */
    tester: RankedTester;
}
export interface JsonFormsRendererConstructable {
    new (props: RendererProps): Renderer<RendererProps, any>;
}
/**
 * Renderer annotation that defines the renderer as a custom elemeent
 * and registers it with the renderer service.
 *
 * @param {JsonFormsRendererConfig} config the renderer config to be registered
 * @constructor
 */
export declare const JsonFormsRenderer: (config: JsonFormsRendererConfig) => (cls: JsonFormsRendererConstructable) => void;
export declare const mapStateToLayoutProps: (state: any, ownProps: any) => {
    renderers: any;
    visible: any;
    path: any;
};
export declare const renderChildren: (elements: UISchemaElement[], schema: JsonSchema, childType: string, path: string) => any[];
export declare const JsonFormsLayout: ({styleName, children, visible}: {
    styleName: any;
    children: any;
    visible: any;
}) => any;
export declare const JsonFormsControl: ({classes, controlId, labelText, validationErrors, children}: {
    classes: any;
    controlId: any;
    labelText: any;
    validationErrors: any;
    children: any;
}) => any;
export declare const formatErrorMessage: (errors: any) => any;

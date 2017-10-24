import { JsonSchema } from '../models/jsonSchema';
import { Renderer, RendererProps } from '../core/renderer';
import { RankedTester } from '../core/testers';
import { UISchemaElement } from '../models/uischema';
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
export declare const formatErrorMessage: (errors: any) => any;
export declare const registerStartupRenderer: (tester: RankedTester, renderer: any) => any;
export declare const mapStateToControlProps: (state: any, ownProps: any) => {
    data: any;
    errors: any[];
    classNames: {
        wrapper: string;
        input: string;
        label: string;
    };
    label: string;
    visible: any;
    enabled: any;
    controlId: string;
    path: string;
};

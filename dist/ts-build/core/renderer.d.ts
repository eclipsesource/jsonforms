import { Component } from '../common/binding';
import { JsonSchema } from '../models/jsonSchema';
import { Scopable, UISchemaElement } from '../models/uischema';
export declare const convertToClassName: (value: string) => string;
export declare const getValue: (data: any, controlElement: Scopable, prefix?: string) => any;
export interface RendererProps {
    /**
     * The UI schema to be rendered.
     */
    uischema: UISchemaElement;
    /**
     * The JSON schema that describes the data.
     */
    schema: JsonSchema;
    /**
     * Whether the rendered element should be visible.
     */
    visible?: boolean;
    /**
     * Whether the rendered element should be enabled.
     */
    enabled?: boolean;
    /**
     * Optional instance path. Necessary when the actual data
     * path can not be inferred via the UI schema element as
     * it is the case with nested controls.
     */
    path?: string;
}
export interface RendererState {
    selected?: any;
}
export declare class Renderer<P extends RendererProps, S> extends Component<P, S> {
    constructor(props: P);
}
export declare const isVisible: (props: any, state: any) => boolean;
export declare const isEnabled: (props: any, state: any) => boolean;
export declare const evalVisibility: (uischema: UISchemaElement, data: any) => boolean;
export declare const evalEnablement: (uischema: UISchemaElement, data: any) => boolean;

import Component from 'inferno-component';
import { JsonSchema } from '../models/jsonSchema';
import { Scopable, UISchemaElement } from '../models/uischema';
import { JsonFormsStore } from '../json-forms';
export declare const convertToClassName: (value: string) => string;
export declare const getValue: (data: any, controlElement: Scopable, prefix?: string) => any;
export interface RendererProps {
    uischema: UISchemaElement;
    store: JsonFormsStore;
    schema: JsonSchema;
}
export interface RendererState {
    selected?: any;
}
export declare class Renderer<P extends RendererProps, S> extends Component<P, S> {
}
export declare const isVisible: (props: any, state: any) => boolean;
export declare const isEnabled: (props: any, state: any) => boolean;
export declare const evalVisibility: (uischema: UISchemaElement, data: any) => boolean;
export declare const evalEnablement: (uischema: UISchemaElement, data: any) => boolean;

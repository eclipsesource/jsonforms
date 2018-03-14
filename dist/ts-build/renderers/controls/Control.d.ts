import { Renderer, RendererProps } from '../../core/renderer';
export interface ControlClassNames {
    input: string;
    label: string;
    wrapper: string;
}
export interface ControlProps extends RendererProps {
    data: any;
    path: string;
    classNames: ControlClassNames;
    id: string;
    visible: boolean;
    enabled: boolean;
    label: string;
    errors: any[];
    dispatch: any;
    required: boolean;
}
export interface ControlState {
    value: any;
}
export declare class Control<P extends ControlProps, S extends ControlState> extends Renderer<P, S> {
    constructor(props: P);
    componentDidUpdate(prevProps: any, prevState: any): void;
    handleChange(value: any): void;
    private updateData(value);
}

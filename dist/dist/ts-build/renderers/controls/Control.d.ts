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
}
export declare class Control<P extends ControlProps, S> extends Renderer<P, S> {
    updateData(value: any): void;
}

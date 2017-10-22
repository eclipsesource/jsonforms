import { Renderer, RendererProps } from '../../core/renderer';
export interface ControlProps extends RendererProps {
    data: any;
    path: string;
}
export declare class Control<P extends ControlProps, S> extends Renderer<P, S> {
    updateData(value: any): void;
}

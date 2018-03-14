import { Provider as ReduxProvider } from 'inferno-redux';
export declare const render: any;
export declare const connect: any;
export declare const Provider: typeof ReduxProvider;
export interface Event<T> {
    currentTarget: T;
}
import InfernoComponent from 'inferno-component';
export declare class Component<P, S> extends InfernoComponent<P, S> {
}
import infernoCreateElement from 'inferno-create-element';
export declare const createElement: typeof infernoCreateElement;

import Inferno from 'inferno';
import {
  connect as reduxConnect,
  Provider as ReduxProvider
} from 'inferno-redux';

export const render: any = Inferno.render;

export const connect: any = reduxConnect;
export const Provider = ReduxProvider;

export interface Event<T> {
  currentTarget: {
    value: any
    checked: boolean;
  };
}

import InfernoComponent from 'inferno-component';
export class Component<P, S> extends InfernoComponent<P, S> { }
import infernoCreateElement from 'inferno-create-element';
export const createElement = infernoCreateElement;
import * as ReactDOM from 'react-dom';
import {
  connect as reduxConnect,
  Provider as ReduxProvider
} from 'react-redux';

export const render = ReactDOM.render;

export const connect: any = reduxConnect;
export const Provider = ReduxProvider;
export { Component, SyntheticEvent as Event } from 'react';
import * as React from 'react';
export const createElement = React.createElement;

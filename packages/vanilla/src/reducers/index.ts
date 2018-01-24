import { findStyle, findStyleAsClassName, stylingReducer } from './styling';
export { stylingReducer };

export const getStyle = state => (styleName: string): string[] =>
  findStyle(state.jsonforms.styles)(styleName);
export const getStyleAsClassName = state => (styleName: string, ...args: any[]) =>
  findStyleAsClassName(state.jsonforms.styles)(styleName, args);

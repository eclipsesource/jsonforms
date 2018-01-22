import { findStyle, findStyleAsClassName, stylingReducer } from './styling';
export { stylingReducer };

export const getStyle = state => (styleName: string): string[] =>
  findStyle(state.styles)(styleName);
export const getStyleAsClassName = state => (styleName: string, ...args: any[]) =>
  findStyleAsClassName(state.styles)(styleName, args);

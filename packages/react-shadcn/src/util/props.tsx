/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import React, { ComponentType } from 'react';
import { useShadcnStyles } from '../styles/styleContext';
import type { ShadcnStyleOverrides } from '../styles/styleContext';

export interface ShadcnRendererProps {
  styleOverrides?: ShadcnStyleOverrides;
}

/**
 * HOC that provides shadcn style overrides to a control component.
 * The component will receive a `styleOverrides` prop containing any
 * custom Tailwind classes from the ShadcnStyleContext.
 *
 * This HOC accepts any component type and adds ShadcnRendererProps to it,
 * allowing it to wrap both raw components and the result of withJsonFormsControlProps.
 */
export const withShadcnControlProps = (
  Component: ComponentType<any>
): ComponentType<any> => {
  function WithShadcnControlProps(props: any) {
    const styleOverrides = useShadcnStyles();
    return <Component {...props} styleOverrides={styleOverrides} />;
  }
  WithShadcnControlProps.displayName = `withShadcnControlProps(${
    Component.displayName || Component.name || 'Component'
  })`;
  return WithShadcnControlProps;
};

/**
 * HOC that provides shadcn style overrides to a layout component.
 */
export const withShadcnLayoutProps = <P extends object>(
  Component: ComponentType<P & ShadcnRendererProps>
) =>
  function WithShadcnLayoutProps(props: P) {
    const styleOverrides = useShadcnStyles();

    return <Component {...props} styleOverrides={styleOverrides} />;
  };

/**
 * HOC that provides shadcn style overrides to a cell component.
 */
export const withShadcnCellProps = <P extends object>(
  Component: ComponentType<P & ShadcnRendererProps>
) =>
  function WithShadcnCellProps(props: P) {
    const styleOverrides = useShadcnStyles();

    return <Component {...props} styleOverrides={styleOverrides} />;
  };

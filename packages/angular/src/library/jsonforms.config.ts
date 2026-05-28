/*
  The MIT License

  Copyright (c) 2017-2020 EclipseSource Munich
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
import { InjectionToken, Provider } from '@angular/core';

export interface JsonFormsAngularConfig {
  /**
   * When true (default), validation error indicators are shown immediately without
   * requiring the user to focus or interact with the field first
   */
  showErrorsImmediately?: boolean;
  [key: string]: unknown;
}

export const angularConfigDefault: JsonFormsAngularConfig = {
  showErrorsImmediately: true,
};

/**
 * Injection token for providing a global JSONForms config via Angular's DI system.
 * Config provided via this token acts as the base; the `config` @Input on the
 * `<jsonforms>` component takes precedence when both are supplied.
 */
export const JSONFORMS_CONFIG = new InjectionToken<JsonFormsAngularConfig>(
  'JsonFormsConfig'
);

/**
 * Returns an Angular provider that sets the global JSONForms config.
 *
 * @example
 * // Standalone bootstrap (app.config.ts)
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideJsonFormsConfig({ showErrorsImmediately: false })],
 * };
 */
export function provideJsonFormsConfig(
  config: JsonFormsAngularConfig
): Provider {
  return { provide: JSONFORMS_CONFIG, useValue: config };
}

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

import {
  createAjv,
  JsonSchema,
  TesterContext,
  Translator,
  UISchemaElement,
} from '@jsonforms/core';
import { JsonFormsReactProps, useJsonForms } from '@jsonforms/react';
import React from 'react';

export const initCore = (
  schema: JsonSchema,
  uischema: UISchemaElement,
  data?: any
) => {
  return { schema, uischema, data, ajv: createAjv() };
};

export const TestEmitter: React.FC<JsonFormsReactProps> = ({ onChange }) => {
  const ctx = useJsonForms();
  const { data, errors } = ctx.core;
  React.useEffect(() => {
    onChange({ data, errors });
  }, [data, errors]);
  return null;
};

export const createTesterContext = (
  rootSchema: JsonSchema,
  config?: any
): TesterContext => {
  return { rootSchema, config };
};

export const testTranslator: Translator = (key: string) => 'translator.' + key;

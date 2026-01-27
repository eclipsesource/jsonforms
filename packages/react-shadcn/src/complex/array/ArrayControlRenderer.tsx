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

import React, { useMemo } from 'react';
import range from 'lodash/range';
import {
  ArrayControlProps,
  composePaths,
  createDefaultValue,
  findUISchema,
  ArrayTranslations,
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  withArrayTranslationProps,
  withJsonFormsArrayControlProps,
  withTranslateProps,
} from '@jsonforms/react';
import { Button } from '../../shadcn/components/ui/button';
import { Card, CardContent, CardHeader } from '../../shadcn/components/ui/card';
import { Label } from '../../shadcn/components/ui/label';
import { cn } from '../../shadcn/lib/utils';
import { useShadcnStyles } from '../../styles/styleContext';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
} from 'lucide-react';

export const ArrayControl = (
  props: ArrayControlProps & { translations: ArrayTranslations }
) => {
  const {
    data,
    label,
    path,
    schema,
    errors,
    addItem,
    removeItems,
    moveUp,
    moveDown,
    uischema,
    uischemas,
    renderers,
    rootSchema,
    translations,
    enabled,
    visible,
  } = props;

  const styleOverrides = useShadcnStyles();

  const childUiSchema = useMemo(
    () =>
      findUISchema(
        uischemas,
        schema,
        uischema.scope,
        path,
        undefined,
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );

  if (!visible) {
    return null;
  }

  const isValid = errors.length === 0;

  return (
    <div className={cn('space-y-4', styleOverrides?.wrapperClasses)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!enabled}
          onClick={addItem(path, createDefaultValue(schema, rootSchema))}
        >
          <Plus className="h-4 w-4 mr-2" />
          {translations.addTooltip}
        </Button>
      </div>
      {!isValid && (
        <div className="text-sm text-destructive">{errors}</div>
      )}
      <div className="space-y-3">
        {data && data.length > 0 ? (
          range(0, data.length).map((index) => {
            const childPath = composePaths(path, `${index}`);
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={!enabled || index === 0}
                      aria-label={translations.upAriaLabel}
                      onClick={() => moveUp(path, index)()}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={!enabled || index === data.length - 1}
                      aria-label={translations.downAriaLabel}
                      onClick={() => moveDown(path, index)()}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={!enabled}
                      aria-label={translations.removeAriaLabel}
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you wish to delete this item?'
                          )
                        ) {
                          removeItems(path, [index])();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <JsonFormsDispatch
                    schema={schema}
                    uischema={childUiSchema || uischema}
                    path={childPath}
                    key={childPath}
                    renderers={renderers}
                  />
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">{translations.noDataMessage}</p>
        )}
      </div>
    </div>
  );
};

export const ArrayControlRenderer = (
  props: ArrayControlProps & { translations: ArrayTranslations }
) => {
  return <ArrayControl {...props} />;
};

export default withJsonFormsArrayControlProps(
  withTranslateProps(withArrayTranslationProps(ArrayControlRenderer))
);

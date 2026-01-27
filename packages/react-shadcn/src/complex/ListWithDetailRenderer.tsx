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
  and,
  ArrayLayoutProps,
  ArrayTranslations,
  composePaths,
  computeLabel,
  createDefaultValue,
  findUISchema,
  isObjectArray,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  withArrayTranslationProps,
  withJsonFormsArrayLayoutProps,
  withTranslateProps,
} from '@jsonforms/react';
import map from 'lodash/map';
import range from 'lodash/range';
import React, { useCallback, useMemo, useState } from 'react';
import { ArrayLayoutToolbar } from '../layouts/ArrayToolbar';
import ListWithDetailMasterItem from './ListWithDetailMasterItem';
import merge from 'lodash/merge';

export const ListWithDetailRenderer = ({
  uischemas,
  schema,
  uischema,
  path,
  enabled,
  errors,
  visible,
  label,
  required,
  removeItems,
  addItem,
  data,
  renderers,
  cells,
  config,
  rootSchema,
  description,
  disableAdd,
  disableRemove,
  translations,
}: ArrayLayoutProps & { translations: ArrayTranslations }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  );

  const handleRemoveItem = useCallback(
    (p: string, value: any) => () => {
      removeItems(p, [value])();
      setSelectedIndex((currentIndex) => {
        if (currentIndex === value) {
          return undefined;
        } else if (currentIndex !== undefined && currentIndex > value) {
          return currentIndex - 1;
        }
        return currentIndex;
      });
    },
    [removeItems]
  );

  const handleListItemClick = useCallback(
    (index: number) => () => setSelectedIndex(index),
    []
  );

  const handleCreateDefaultValue = useCallback(
    () => createDefaultValue(schema, rootSchema),
    [schema, rootSchema]
  );

  const foundUISchema = useMemo(
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

  const appliedUiSchemaOptions = useMemo(
    () => merge({}, config, uischema.options),
    [config, uischema.options]
  );
  const doDisableAdd = disableAdd || appliedUiSchemaOptions.disableAdd;
  const doDisableRemove = disableRemove || appliedUiSchemaOptions.disableRemove;

  React.useEffect(() => {
    setSelectedIndex(undefined);
  }, [schema]);

  if (!visible) {
    return null;
  }

  return (
    <div className="space-y-4">
      <ArrayLayoutToolbar
        translations={translations}
        label={computeLabel(
          label,
          required,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
        description={description}
        errors={errors}
        path={path}
        enabled={enabled}
        addItem={addItem}
        createDefault={handleCreateDefaultValue}
        disableAdd={doDisableAdd}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden">
            {data > 0 ? (
              map(range(data), (index) => (
                <ListWithDetailMasterItem
                  key={index}
                  index={index}
                  path={path}
                  schema={schema}
                  enabled={enabled}
                  handleSelect={handleListItemClick}
                  removeItem={handleRemoveItem}
                  selected={selectedIndex === index}
                  uischema={foundUISchema}
                  childLabelProp={appliedUiSchemaOptions.elementLabelProp}
                  translations={translations}
                  disableRemove={doDisableRemove}
                />
              ))
            ) : (
              <p className="p-4 text-muted-foreground text-sm">
                {translations.noDataMessage}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-9">
          {selectedIndex !== undefined && foundUISchema ? (
            <JsonFormsDispatch
              renderers={renderers}
              cells={cells}
              visible={visible}
              schema={schema}
              uischema={foundUISchema}
              path={composePaths(path, `${selectedIndex}`)}
            />
          ) : selectedIndex !== undefined ? (
            <p className="text-lg text-muted-foreground">
              No UI schema found for detail view
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">
              {translations.noSelection}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const listWithDetailTester: RankedTester = rankWith(
  4,
  and(uiTypeIs('ListWithDetail'), isObjectArray)
);

export default withJsonFormsArrayLayoutProps(
  withTranslateProps(withArrayTranslationProps(ListWithDetailRenderer))
);

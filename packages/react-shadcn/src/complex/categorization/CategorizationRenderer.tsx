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

import React, { useState, useMemo } from 'react';
import type {
  Categorization,
  Category,
  LayoutProps,
} from '@jsonforms/core';
import {
  deriveLabelForUISchemaElement,
  isVisible,
} from '@jsonforms/core';
import {
  TranslateProps,
  withJsonFormsLayoutProps,
  withTranslateProps,
  useJsonForms,
} from '@jsonforms/react';
import { SingleCategory } from './SingleCategory';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../shadcn/components/ui/tabs';
import { cn } from '../../shadcn/lib/utils';
import { useShadcnStyles } from '../../styles/styleContext';

interface CategorizationProps {
  selected?: number;
  onChange?(selected: number, prevSelected: number): void;
}

export const CategorizationRenderer = ({
  data,
  uischema,
  schema,
  path,
  selected,
  t,
  visible,
  onChange,
  config,
}: LayoutProps & TranslateProps & CategorizationProps) => {
  const categorization = uischema as Categorization;
  const styleOverrides = useShadcnStyles();
  const ctx = useJsonForms();
  const ajv = ctx.core?.ajv;

  const [previousCategorization, setPreviousCategorization] =
    useState<Categorization>(categorization);
  const [activeCategory, setActiveCategory] = useState<number>(selected ?? 0);

  // Reset to first tab if categorization changes
  if (categorization !== previousCategorization) {
    setActiveCategory(0);
    setPreviousCategorization(categorization);
  }

  // Filter visible categories
  const visibleCategories = useMemo(() => {
    return (categorization.elements as Category[]).filter((category) =>
      isVisible(category, data, undefined, ajv, config)
    );
  }, [categorization.elements, data, ajv, config]);

  // Get category labels
  const categoryLabels = useMemo(
    () => visibleCategories.map((cat) => deriveLabelForUISchemaElement(cat, t)),
    [visibleCategories, t]
  );

  const safeCategory =
    activeCategory >= visibleCategories.length ? 0 : activeCategory;

  const handleCategoryChange = (value: string) => {
    const newIndex = parseInt(value, 10);
    if (onChange) {
      onChange(newIndex, safeCategory);
    }
    setActiveCategory(newIndex);
  };

  if (!visible) {
    return null;
  }

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <Tabs
      value={String(safeCategory)}
      onValueChange={handleCategoryChange}
      className={cn(styleOverrides?.wrapperClasses)}
    >
      <TabsList>
        {categoryLabels.map((label, index) => (
          <TabsTrigger key={index} value={String(index)}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {visibleCategories.map((category, index) => (
        <TabsContent key={index} value={String(index)}>
          <SingleCategory category={category} schema={schema} path={path} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default withTranslateProps(withJsonFormsLayoutProps(CategorizationRenderer));

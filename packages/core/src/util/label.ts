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

import startCase from 'lodash/startCase';

import { ControlElement, JsonSchema, LabelDescription } from '../models';
import { decode } from './path';

const deriveLabel = (
  controlElement: ControlElement,
  schemaElement?: JsonSchema
): string => {
  if (schemaElement && typeof schemaElement.title === 'string') {
    return schemaElement.title;
  }
  if (typeof controlElement.scope === 'string') {
    const ref = controlElement.scope;
    const label = decode(ref.substr(ref.lastIndexOf('/') + 1));
    return startCase(label);
  }

  return '';
};

export const createCleanLabel = (label: string): string => {
  return startCase(label.replace('_', ' '));
};

/**
 * Return a label object based on the given control and schema element.
 * @param {ControlElement} withLabel the UI schema to obtain a label object for
 * @param {JsonSchema} schema optional: the corresponding schema element
 * @returns {LabelDescription}
 */
export const createLabelDescriptionFrom = (
  withLabel: ControlElement,
  schema?: JsonSchema
): LabelDescription => {
  const labelProperty = withLabel.label;
  if (typeof labelProperty === 'boolean') {
    return labelDescription(deriveLabel(withLabel, schema), labelProperty);
  }
  if (typeof labelProperty === 'string') {
    return labelDescription(labelProperty, true);
  }
  if (typeof labelProperty === 'object') {
    const label =
      typeof labelProperty.text === 'string'
        ? labelProperty.text
        : deriveLabel(withLabel, schema);
    const show =
      typeof labelProperty.show === 'boolean' ? labelProperty.show : true;
    return labelDescription(label, show);
  }
  return labelDescription(deriveLabel(withLabel, schema), true);
};

const labelDescription = (text: string, show: boolean): LabelDescription => ({
  text: text,
  show: show,
});

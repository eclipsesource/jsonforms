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

import {
  ControlElement,
  JsonSchema,
  LabelDescription,
  UISchemaElement,
} from '../models';
import { decode } from './path';
import { getI18nKeyPrefix, Translator } from '../i18n';
import { Resolve } from './util';
import {
  getFirstPrimitiveProp,
  isEnumSchema,
  isOneOfEnumSchema,
} from './schema';
import get from 'lodash/get';
import { findUiControl, getPropPath } from './uischema';
import {
  EnumOption,
  enumToEnumOptionMapper,
  oneOfToEnumOptionMapper,
} from './renderer';
import isEqual from 'lodash/isEqual';

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

/**
 * Compute the child label title for array based controls
 * @param data the data of the control
 * @param childPath the child path
 * @param childLabelProp the dotted path to the value used as child label
 * @param {JsonSchema} schema the json schema for this control
 * @param {JsonSchema} rootSchema the root json schema
 * @param {Translator} translateFct the translator fonction
 * @param {UISchemaElement} uiSchema the uiSchema of the control
 */
export const computeChildLabel = (
  data: any,
  childPath: string,
  childLabelProp: string,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  translateFct: Translator,
  uiSchema: UISchemaElement
): string => {
  const childData = Resolve.data(data, childPath);

  if (!childLabelProp) {
    childLabelProp = getFirstPrimitiveProp(schema);
  }

  // return early in case there is no prop we can query
  if (!childLabelProp) {
    return '';
  }

  const currentValue = get(childData, childLabelProp);

  // in case there is no value, then we can't map it to an enum or oneOf
  if (currentValue === undefined) {
    return '';
  }

  // check whether the value is part of a oneOf or enum and needs to be translated
  const childSchema = Resolve.schema(
    schema,
    '#' + getPropPath(childLabelProp),
    rootSchema
  );

  let enumOption: EnumOption = undefined;
  if (isEnumSchema(childSchema)) {
    enumOption = enumToEnumOptionMapper(
      currentValue,
      translateFct,
      getI18nKeyPrefix(
        childSchema,
        findUiControl(uiSchema, childLabelProp),
        childPath + '.' + childLabelProp
      )
    );
  } else if (isOneOfEnumSchema(childSchema)) {
    const oneOfArray = childSchema.oneOf as JsonSchema[];
    const oneOfSchema = oneOfArray.find((e: JsonSchema) =>
      isEqual(e.const, currentValue)
    );

    if (oneOfSchema) {
      enumOption = oneOfToEnumOptionMapper(
        oneOfSchema,
        translateFct,
        getI18nKeyPrefix(
          oneOfSchema,
          undefined,
          childPath + '.' + childLabelProp
        )
      );
    }
  }

  return enumOption ? enumOption.label : currentValue;
};

/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import * as _ from 'lodash';

import { ControlElement, LabelDescription } from '../models/uischema';

const deriveLabel = (controlElement: ControlElement): string => {

  if (controlElement.scope !== undefined) {
    const ref = controlElement.scope;
    const label = ref.substr(ref.lastIndexOf('/') + 1);

    return _.startCase(label);
  }

  return '';
};
/**
 * Return a label object based on the given control element.
 * @param {ControlElement} withLabel the UI schema to obtain a label object for
 * @returns {LabelDescription}
 */
export const createLabelDescriptionFrom = (withLabel: ControlElement): LabelDescription => {
  const labelProperty = withLabel.label;
  const derivedLabel = deriveLabel(withLabel);
  if (typeof labelProperty === 'boolean') {
    if (labelProperty) {
      return {
        text: derivedLabel,
        show: labelProperty
      };
    } else {
      return {
        text: derivedLabel,
        show: labelProperty as boolean
      };
    }
  } else if (typeof labelProperty === 'string') {
    return {
      text: labelProperty as string,
      show: true
    };
  } else if (typeof labelProperty === 'object') {
    const show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
    const label = labelProperty.hasOwnProperty('text') ?
      labelProperty.text : derivedLabel;

    return {
      text: label,
      show
    };
  } else {
    return {
      text: derivedLabel,
      show: true
    };
  }
};

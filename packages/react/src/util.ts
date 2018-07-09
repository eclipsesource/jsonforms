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
import {
  mapDispatchToControlProps,
  mapStateToControlProps,
  UISchemaElement
} from '@jsonforms/core';
import { connect } from 'react-redux';

const idMappings: Map<UISchemaElement, string> = new Map<UISchemaElement, string>();
const getID = (element: UISchemaElement, proposedID: string) => {
  if (!idMappings.has(element)) {
    let tries = 0;
    while (!isUniqueID(proposedID, tries)) {
      tries++;
    }
    const newID = createID(proposedID, tries);
    idMappings.set(element, newID);
  }
  return idMappings.get(element);
};
const isUniqueID = (idBase: string, iteration: number) => {
  const newID = createID(idBase, iteration);
  for (const value of Array.from(idMappings.values())) {
    if (value === newID) {
      return false;
    }
  }
  return true;
};
const createID = (idBase: string, iteration: number) =>
  iteration !== 0 ? idBase + iteration : idBase;

/**
 * JSONForms specific connect function. This is a wrapper
 * around redux's connect function and is provided for convenience
 * reasons.
 *
 * @param {(state, ownProps) => any} mapStateToProps
 * @param {(dispatch, ownProps) => any} mapDispatchToProps
 * @returns {(Component) => any} function expecting a Renderer Component to be connected
 */
export const connectToJsonForms = (
  mapStateToProps: (state, ownProps) => any = mapStateToControlProps,
  mapDispatchToProps: (dispatch, ownProps) => any = mapDispatchToControlProps) => Component => {

    return connect(
      (state, ownProps) => {
        let props = mapStateToProps(state, ownProps);
        // Make sure IDs are unique
        if (props.scopedSchema !== undefined) {
          props = {
            ...props,
            id: getID(props.uischema, props.id)
          };
        }
        if (props.scopedSchema !== undefined &&
          (props.scopedSchema.type === 'integer' || props.scopedSchema.type === 'number')) {
          return {
            ...props,
            id: getID(props.uischema, props.id),
            toFormatted: n => n === null || n === undefined ? '' : n.toString(),
            fromFormatted: s => Number(s)
          };
        }

        return {
          ...props,
          id: getID(props.uischema, props.id),
        };
      },
      mapDispatchToProps
    )(Component);
  };

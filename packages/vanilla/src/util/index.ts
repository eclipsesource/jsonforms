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
import {
    ControlElement,
    convertToValidClassName,
    getConfig,
    JsonFormsState,
    OwnPropsOfControl,
    OwnPropsOfField,
    OwnPropsOfRenderer,
    RendererProps,
    StatePropsOfControl,
    StatePropsOfField
} from '@jsonforms/core';
import { getStyle, getStyleAsClassName } from '../reducers';
import { VanillaRendererProps } from '../index';

/**
 * A style associates a name with a list of CSS class names.
 */
export interface StyleDef {
    name: string;
    classNames: string[] | ((...args: any[]) => string[]);
}

/**
 * Add vanilla props to the return value of calling the given
 * mapStateToProps function.
 *
 * @param mapStateToProps existing mapStateToProps function
 * @returns {VanillaControlStateProps} vanilla-specific control props
 */
export const addVanillaControlProps = <P extends StatePropsOfControl>
(mapStateToProps: (s: JsonFormsState, p: OwnPropsOfControl) => P) =>
    (state: JsonFormsState,
     ownProps: OwnPropsOfControl): StatePropsOfControl & VanillaRendererProps => {

        const props: StatePropsOfControl = mapStateToProps(state, ownProps);
        const config = getConfig(state);
        const trim = config.trim;
        const controlElement = props.uischema as ControlElement;
        const isValid = _.isEmpty(props.errors);
        const styles = getStyle(state)('control');
        let classNames: string[] = !_.isEmpty(controlElement.scope) ?
            styles.concat(
                [`${convertToValidClassName(controlElement.scope)}`]
            ) : [''];

        if (trim) {
            classNames = classNames.concat(getStyle(state)('control.trim'));
        }
        const labelClass = getStyleAsClassName(state)('control.label');
        const descriptionClassName = getStyleAsClassName(state)('input.description');
        const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

        return {
            ...props,
            getStyleAsClassName:  getStyleAsClassName(state),
            getStyle:  getStyle(state),
            classNames: {
                wrapper: classNames.join(' '),
                input: inputClassName.join(' '),
                label: labelClass,
                description: descriptionClassName
            },
        };
    };

/**
 * Add vanilla props to the return value of calling the given
 * mapStateToProps function.
 *
 * @param mapStateToProps an existing mapStateToProps function for retrieving layout props
 * @returns {VanillaLayoutProps} vanilla specific layout props
 */
export const addVanillaLayoutProps =
    (mapStateToProps: (s: JsonFormsState, p: OwnPropsOfRenderer) => RendererProps) =>
        (state: JsonFormsState,
         ownProps: OwnPropsOfRenderer): RendererProps & VanillaRendererProps => {

            const props = mapStateToProps(state, ownProps);

            return {
                ...props,
                getStyleAsClassName:  getStyleAsClassName(state),
                getStyle:  getStyle(state),
            };
        };

export const addVanillaFieldProps =
    (mapStateToFieldsProps: (s: JsonFormsState, p: OwnPropsOfField) => StatePropsOfField) =>
        (state: JsonFormsState,
         ownProps: OwnPropsOfField): StatePropsOfField & VanillaRendererProps => {
            const props = mapStateToFieldsProps(state, ownProps);
            const inputClassName = ['validate'].concat(props.isValid ? 'valid' : 'invalid');
            return {
                ...props,
                className: inputClassName.join(' '),
                getStyleAsClassName:  getStyleAsClassName(state),
                getStyle:  getStyle(state),
            };
        };

/**
 * Pre-defined vanilla styles.
 *
 * @type {{name: string; classNames: string[]}[]}
 */
export const vanillaStyles = [
    {
        name: 'control',
        classNames: ['control']
    },
    {
        name: 'control.trim',
        classNames: ['trim']
    },
    {
        name: 'control.input',
        classNames: ['input']
    },
    {
        name: 'control.validation',
        classNames: ['validation']
    },
    {
        name: 'categorization',
        classNames: ['categorization']
    },
    {
        name: 'categorization.master',
        classNames: ['categorization-master']
    },
    {
        name: 'categorization.detail',
        classNames: ['categorization-detail']
    },
    {
        name: 'category.group',
        classNames: ['category-group']
    },
    {
        name: 'array.layout',
        classNames: ['array-layout']
    },
    {
        name: 'array.children',
        classNames: ['children']
    },
    {
        name: 'group.layout',
        classNames: ['group-layout']
    },
    {
        name: 'horizontal.layout',
        classNames: ['horizontal-layout']
    },
    {
        name: 'horizontal.layout.item',
        classNames: ([size]: number[]) => [`horizontal-layout-${size}`]
    },
    {
        name: 'vertical.layout',
        classNames: ['vertical-layout']
    },
    {
        name: 'array.table',
        classNames: ['array-table-layout', 'control']
    },
    {
        name: 'input.description',
        classNames: ['input-description']
    }
];

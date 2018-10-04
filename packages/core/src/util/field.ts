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
import { ControlElement } from '../models/uischema';
import { findUISchema, getConfig, getData, getErrorAt } from '../reducers';
import {
    composeWithUi,
    isEnabled,
    isVisible,
    OwnPropsOfControl,
    OwnPropsOfEnum,
    Resolve,
    StatePropsOfField,
    StatePropsOfScopedRenderer
} from '../util';
import { DispatchPropsOfControl, mapDispatchToControlProps } from './renderer';
import { JsonFormsState } from '../store';
import { AnyAction, Dispatch } from 'redux';
import { JsonFormsFieldRendererRegistryEntry } from '../reducers/fields';

export interface OwnPropsOfField extends OwnPropsOfControl {
    data?: any;
}

/**
 * State props of a field.
 */
export interface StatePropsOfField extends StatePropsOfScopedRenderer {
    isValid: boolean;
}

export interface OwnPropsOfEnumField extends OwnPropsOfField, OwnPropsOfEnum {
}

/**
 * State props of a field for enum field
 */
export interface StatePropsOfEnumField extends StatePropsOfField, OwnPropsOfEnum {
}

/**
 * Props of an enum field.
 */
export interface EnumFieldProps extends StatePropsOfEnumField, DispatchPropsOfControl {

}

export type DispatchPropsOfField = DispatchPropsOfControl;

/**
 * Props of a field.
 */
export interface FieldProps extends StatePropsOfField, DispatchPropsOfField {

}
/**
 * Registers the given field renderer when a JSON Forms store is created.
 * @param {RankedTester} tester
 * @param field the field to be registered
 * @returns {any}
 */
export interface DispatchFieldStateProps extends StatePropsOfField {
    fields?: JsonFormsFieldRendererRegistryEntry[];
}

export const mapStateToDispatchFieldProps =
    (state: JsonFormsState, ownProps: OwnPropsOfField): DispatchFieldStateProps => {
        const props = mapStateToFieldProps(state, ownProps);
        return {
            ...props,
            fields: state.jsonforms.fields || []
        };
    };

export interface DispatchFieldProps extends DispatchFieldStateProps {

}

/**
 * Map state to field props.
 *
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfField} state props of a field
 */
export const mapStateToFieldProps =
    (state: JsonFormsState, ownProps: OwnPropsOfField): StatePropsOfField => {
        const path = composeWithUi(ownProps.uischema, ownProps.path);
        const visible = _.has(ownProps, 'visible') ? ownProps.visible : isVisible(ownProps, state);
        const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : isEnabled(ownProps, state);
        const errors = getErrorAt(path)(state).map(error => error.message);
        const isValid = _.isEmpty(errors);
        const controlElement = ownProps.uischema as ControlElement;
        const id = ownProps.id;
        const defaultConfig = _.cloneDeep(getConfig(state));
        const config = _.merge(
            defaultConfig,
            ownProps.uischema.options
        );

        return {
            data: ownProps.data !== undefined ?
                Resolve.data(ownProps.data, path) :
                Resolve.data(getData(state), path),
            visible,
            enabled,
            id,
            path,
            errors,
            isValid,
            scopedSchema: Resolve.schema(ownProps.schema, controlElement.scope),
            uischema: ownProps.uischema,
            schema: ownProps.schema,
            config,
            findUISchema: findUISchema(state)
        };
    };

/**
 * Default mapStateToFieldProps for enum field. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfEnumField}
 */
export const defaultMapStateToEnumFieldProps =
    (state: JsonFormsState, ownProps: OwnPropsOfEnumField): StatePropsOfEnumField => {
        const props: StatePropsOfField = mapStateToFieldProps(state, ownProps);
        const options = ownProps.options !== undefined ? ownProps.options : props.scopedSchema.enum;
        return {
            ...props,
            options
        };
    };

/**
 * Synonym for mapDispatchToControlProps.
 *
 * @type {(dispatch) => {handleChange(path, value): void}}
 */
export const mapDispatchToFieldProps: (dispatch: Dispatch<AnyAction>) => DispatchPropsOfControl =
    mapDispatchToControlProps;

/**
 * Default dispatch to control props which can be customized to set handleChange action
 *
 */
export const defaultMapDispatchToControlProps =
    // TODO: ownProps types
    (dispatch: Dispatch<AnyAction>, ownProps: any): DispatchPropsOfControl => {
        const dispatchControlProps: DispatchPropsOfControl = mapDispatchToFieldProps(dispatch);

        return {
            handleChange: ownProps.handleChange !== undefined ?
                ownProps.handleChange : dispatchControlProps.handleChange
        };
    };

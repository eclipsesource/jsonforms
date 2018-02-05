import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { JsonForms } from '../core';
import {
  composeWithUi,
  createLabelDescriptionFrom,
  isEnabled,
  isVisible,
  Resolve,
  translateLabel
} from '../util';
import { RankedTester } from '../testers';
import { ControlElement } from '../models/uischema';
import { getData, getErrorAt, getSubErrorsAt, getTranslations } from '../reducers';
import { Renderer, RendererProps } from '../renderers/Renderer';
import { update } from '../actions';

/**
 * A renderer config that is used during renderer registration.
 */
export interface JsonFormsRendererConfig {
    /**
     * The tester that that determines how applicable
     * the renderer is.
     */
    tester: RankedTester;
}

export interface JsonFormsRendererConstructable {
  // TODO: any state?
  new(props: RendererProps): Renderer<RendererProps, any>;
}

export const mapStateToLayoutProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    renderers: state.renderers,
    visible,
    path: ownProps.path,
  };
};

export const registerStartupRenderer = (tester: RankedTester, renderer: any) => {
  JsonForms.renderers.push({
    tester,
    renderer
  });

  return renderer;
};
const isRequired = (schema: JsonSchema, schemaPath: string): boolean => {
     const pathSegments = schemaPath.split('/');
     const lastSegment = pathSegments[pathSegments.length - 1];
     const nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
     const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
     const nextHigherSchema = Resolve.schema(schema, nextHigherSchemaPath);

     return nextHigherSchema !== undefined
         && nextHigherSchema.required !== undefined
         && nextHigherSchema.required.indexOf(lastSegment) !== -1;
 };

export const computeLabel = (label: string, required: boolean): string => {
   return required ? label + '*' : label;
 };

export const isDescriptionHidden = (visible, description, isFocused) => {
  return  description === undefined ||
  (description !== undefined && !visible) ||
  !isFocused;
};

/**
 * Number is formatted based on the current locale value.
 * If user enters a decimal point, the corresponding decimal separator is added as the last
 * character of the locale string
 *
 * @param {string} data
 * @param {string} locale
 * @param {string} decimalSeparator
 * @returns {string}
 */
export const convertNumberToLocaleString =
  (data: string, locale: string, decimalSeparator: string) : string => {
  let localeString = '';
  if (data !== '' && data !== undefined && data !== null) {
    if (_.last(data) === '.') {
      localeString =
        new Intl.NumberFormat(locale, { maximumFractionDigits: 10 }).format(parseFloat(data));
      localeString += decimalSeparator;
    } else {
      localeString =
        new Intl.NumberFormat(locale, { maximumFractionDigits: 10 }).format(parseFloat(data));
    }
  }

  return localeString;
};

/**
 * It coverts the given string number by the user to a valid string number before updating state
 * Local thousands separators are removed, local decimal separators are replaced with '.'
 *
 * @param ev
 * @param numberSeparators
 * @returns {string}
 */

export const convertLocaleStringToValidStringNumber = (ev, numberSeparators: any): string => {
  const numberSeparatorRegex = new RegExp(/\.|,/g, 'gi');
  const numberFormat = {};
  numberFormat[numberSeparators.decimalSeparator] = '.';
  numberFormat[numberSeparators.thousandsSeparator] = '';
  const validStringNumber = ev.currentTarget.value.replace(numberSeparatorRegex, matched => {
    return numberFormat[matched];
  });

  return validStringNumber;
};

export const mapStateToControlProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled :  isEnabled(ownProps, state);
  const labelDesc = translateLabel(getTranslations(state), createLabelDescriptionFrom(ownProps.uischema));
  const label = labelDesc.show ? labelDesc.text : '';
  const errors = getErrorAt(path)(state).map(error => error.message);
  const controlElement = ownProps.uischema as ControlElement;
  const id = controlElement.scope || '';
  const required =
      controlElement.scope !== undefined && isRequired(ownProps.schema, controlElement.scope);
  const fields = state.jsonforms.fields;

  return {
    data: Resolve.data(getData(state), path),
    errors,
    label,
    visible,
    enabled,
    id,
    path,
    parentPath: ownProps.path,
    fields,
    required
  };
};

export const mapDispatchToControlProps = dispatch => ({
  handleChange(path, value) {
    dispatch(update(path, () => value));
  }
});

export const mapStateToTableControlProps = (state, ownProps) => {
  const {path, ...props} = mapStateToControlProps(state, ownProps);

  const childErrors = getSubErrorsAt(path)(state);
  const controlElement = ownProps.uischema as ControlElement;
  const resolvedSchema = Resolve.schema(ownProps.schema, controlElement.scope + '/items');

  return {
    ...props,
    path,
    childErrors,
    resolvedSchema
  };
};
export const mapDispatchToTableControlProps = dispatch => ({
  addItem: (path: string) => () => {
    dispatch(
      update(
        path,
        array => {
          if (array === undefined || array === null) {
            return [{}];
          }

          const clone = _.clone(array);
          clone.push({});

          return clone;
        }
      )
    );
  },
  removeItems: (path: string, toDelete: any[]) => () => {
    dispatch(
      update(
        path,
        array => {
          const clone = _.clone(array);
          toDelete.forEach(s => clone.splice(clone.indexOf(s), 1));

          return clone;
        }
      )
    );
  }
});

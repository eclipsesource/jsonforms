import * as _ from 'lodash';
import * as React from 'react';
import {
  and,
  compose,
  composeWithUi,
  ControlElement,
  ControlProps,
  convertToClassName,
  DispatchRenderer,
  generateDefaultUISchema,
  getData,
  getElementLabelObject,
  JsonForms,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveData,
  resolveSchema,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs,
  update
} from 'jsonforms-core';
import { connect } from 'react-redux';

export const getStyle = (styleName: string) =>
  JsonForms.stylingRegistry.getAsClassName(styleName);

/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
export const arrayTester: RankedTester = rankWith(3, and(
  uiTypeIs('Control'),
  schemaMatches(schema =>
    !_.isEmpty(schema)
    && schema.type === 'array'
    && !_.isEmpty(schema.items)
    && !Array.isArray(schema.items) // we don't care about tuples
  ),
  schemaSubPathMatches('items', schema =>
    schema.type === 'object'
  ))
);

const addNewItem = (dispatch, path: string) => {
  const element = {};
  dispatch(
    update(
      path,
      array => {
        if (array === undefined || array === null) {
          return [element];
        }

        const clone = _.clone(array);
        clone.push(element);

        return clone;
      }
    )
  );
};

export const ArrayControlRenderer  =
  ({  schema, uischema, data, path, dispatch }: ControlProps) => {

    const controlElement = uischema as ControlElement;
    const label = getElementLabelObject(schema, controlElement);
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref + '/items');
    const className = `control ${(convertToClassName(controlElement.scope.$ref))}`;

    return (
      <div className={className}
      >
        <fieldset className={getStyle('array.layout')}>
          <legend>
            <button
              className={getStyle('array.button')}
              onClick={() => addNewItem(dispatch, path)}
            >
              +
            </button>
            <label className={'array.label'}>
              { label.show ? label.text : '' }
            </label>
          </legend>
          <div className={JsonForms.stylingRegistry.getAsClassName('array.children')}>
            {
              data ? data.map((child, index) => {

                const generatedUi = generateDefaultUISchema(resolvedSchema, 'HorizontalLayout');
                const childPath = compose(path, index + '');

                return (
                  <DispatchRenderer
                    schema={resolvedSchema}
                    uischema={generatedUi}
                    path={childPath}
                    key={childPath}
                  >
                  </DispatchRenderer>
                );
              }) : <p>No data</p>
            }
          </div>
        </fieldset>
      </div>
    );
  };

const mapStateToProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);

  return {
    data: resolveData(getData(state), path),
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    path
  };
};

export default registerStartupRenderer(
  arrayTester,
  connect(mapStateToProps)(ArrayControlRenderer)
);

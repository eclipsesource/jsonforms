import * as _ from 'lodash';
import { convertToClassName, Renderer } from '../../core/renderer';
import {
  and,
  RankedTester,
  rankWith,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs
} from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { compose, composeWithUi, resolveData, resolveSchema } from '../../path.util';
import { getElementLabelObject } from '../label.util';
import { JsonForms } from '../../core';
import { generateDefaultUISchema } from '../../generators/ui-schema-gen';
import { update } from '../../actions';
import { connect } from 'inferno-redux';
import { getData } from '../../reducers/index';
import DispatchRenderer from '../dispatch.renderer';
import {ControlProps} from "../controls/Control";

export const getStyle = (styleName: string) =>
  JsonForms.stylingRegistry.getAsClassName(styleName);

/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
export const arrayTester: RankedTester = rankWith(2, and(
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

export class ArrayControlRenderer extends Renderer<ControlProps, void> {

  addNewItem(path: string) {
    const element = {};
    this.props.dispatch(
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
  }

  /**
   * @inheritDoc
   */
  render() {
    const { schema, uischema, data, path } = this.props;
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
              onclick={() => this.addNewItem(path)}
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
                  >
                  </DispatchRenderer>
                );
              }) : <p>No data</p>
            }
          </div>
        </fieldset>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);

  return {
    data: resolveData(getData(state), path),
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    path
  };
};

export default JsonForms.rendererService.registerRenderer(
  arrayTester,
  connect(mapStateToProps)(ArrayControlRenderer)
);

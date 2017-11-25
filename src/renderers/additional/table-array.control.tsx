import { JSX } from '../JSX';
import * as _ from 'lodash';
import { JsonForms } from '../../core';
import { convertToClassName, Renderer } from '../../core/renderer';
import { and, optionIs, RankedTester, rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { JsonSchema } from '../../models/jsonSchema';
import { ControlElement } from '../../models/uischema';
import { getLabelObject } from '../label.util';
import { compose, composeWithUi, resolveData, resolveSchema } from '../../path.util';
import { update } from '../../actions';
import { getData } from '../../reducers/index';
import DispatchRenderer from '../dispatch-renderer';
import { ControlProps } from '../controls/Control';
import { registerStartupRenderer } from '../renderer.util';
import { connect } from '../../common/binding';

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const tableArrayTester: RankedTester = rankWith(10, and(
    uiTypeIs('Control'),
    optionIs('table', true),
    schemaMatches(schema =>
        !_.isEmpty(schema)
        && schema.type === 'array'
        && !_.isEmpty(schema.items)
        && !Array.isArray(schema.items) // we don't care about tuples
        && (schema.items as JsonSchema).type === 'object'
    ))
);

export class TableArrayControl extends Renderer<ControlProps, void> {

  // TODO duplicate code
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
    const { uischema, schema, path, data } = this.props;
    const controlElement = uischema as ControlElement;

    const tableClasses = [
      JsonForms.stylingRegistry.getAsClassName('array-table.table'),
      `control ${convertToClassName(controlElement.scope.$ref)}`
    ];
    const labelClass = JsonForms.stylingRegistry.getAsClassName('array-table.label');
    const buttonClass = JsonForms.stylingRegistry.getAsClassName('array-table.button');
    const headerClass = JsonForms.stylingRegistry.getAsClassName('array-table')
      .concat(convertToClassName(controlElement.scope.$ref));

    const labelObject = getLabelObject(controlElement);
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref + '/items');
    const createControlElement = (key: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: { $ref: `#/properties/${key}` }
    });

    return (
      <div className={tableClasses.join(' ')}>
        <header className={headerClass}>
          <label className={labelClass}>
            {
              labelObject.show && labelObject.text
            }
          </label>
          <button
            className={buttonClass}
            onClick={ () => this.addNewItem(path) }
          >
            Add to {labelObject.text}
          </button>
        </header>
        <table>
          <thead>
          <tr>
            {
              _(resolvedSchema.properties)
                .keys()
                .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                .map(prop => <th key={prop}>{prop}</th>)
                .value()
            }
          </tr>
          </thead>
          <tbody>
          {
            data ? data.map((child, index) => {
              const childPath = compose(path, index + '');

              return (
                <tr key={childPath}>
                  {
                    _.chain(resolvedSchema.properties)
                      .keys()
                      .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                      .map((prop, idx) => {
                        return (
                          <td key={compose(childPath, idx.toString())}>
                            <DispatchRenderer
                              schema={resolvedSchema}
                              uischema={createControlElement(prop)}
                              path={childPath}
                            />
                          </td>
                        );
                      })
                      .value()
                  }
                </tr>
              );
            })  : <p>No data</p>
          }
          </tbody>
        </table>
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

export default registerStartupRenderer(
  tableArrayTester,
  connect(mapStateToProps)(TableArrayControl)
);

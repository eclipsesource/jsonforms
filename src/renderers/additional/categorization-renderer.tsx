import * as _ from 'lodash';
import { JsonForms } from '../../core';
import { Renderer } from '../../core/renderer';
import { and, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Categorization, Category } from '../../models/uischema';
import { mapStateToLayoutProps } from '../renderer.util';
import { connect } from 'inferno-redux';
import DispatchRenderer from '../dispatch.renderer';

const isCategorization = (category: Category | Categorization): category is Categorization => {
  return category.type === 'Categorization';
};

/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
export const categorizationTester: RankedTester =    rankWith(
        1,
        and(
            uiTypeIs('Categorization'),
            uischema => {
              const hasCategory = (element: Categorization): boolean => {
                if (_.isEmpty(element.elements)) {
                  return false;
                }

                return element.elements
                    .map(elem => isCategorization(elem) ?
                        hasCategory(elem) :
                        elem.type === 'Category'
                    )
                    .reduce((prev, curr) => prev && curr, true);
              };

              return hasCategory(uischema as Categorization);
            }
        ));

class CategorizationRenderer extends Renderer {

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, visible, enabled } = this.props;
    const controlElement = uischema as Categorization;
    const categorization = uischema as Categorization;
    const classNames = [].concat(
      JsonForms.stylingRegistry.getAsClassName('categorization')
    );
    const masterClassNames = [].concat(
      JsonForms.stylingRegistry.getAsClassName('categorization.master')
    );
    const detailClassNames = [].concat(
      JsonForms.stylingRegistry.getAsClassName('categorization.detail')
    );

    return (
      <fieldset className={classNames}
           hidden={visible === null || visible === undefined ? false : !visible}
           disabled={enabled === null || enabled === undefined ? false : !enabled}
      >
        <div className={masterClassNames}>
          {
            this.createCategorization(categorization)
          }
        </div>
        <div className={detailClassNames}>
          {
            this.renderCategory(this.findCategory(controlElement))
          }
        </div>
      </fieldset>
    );
  }

  private findCategory(categorization: Categorization):  Category {
    const category = categorization.elements[0];

    if (this.state && this.state.selected) {
      return this.state.selected.category;
    }

    if (isCategorization(category)) {
      return this.findCategory(category);
    }

    return category;
  }

  private renderCategory(category: Category) {
    const { schema, path } = this.props;

    // TODO: add selected style
    if (category.elements === undefined) {
      return (<div id='categorization.detail'/>);
    }

    return (
      <div id='categorization.detail'>
        {
          category.elements.map(child =>
            (
              <DispatchRenderer
                uischema={child}
                schema={schema}
                path={path}
              />
            )
          )
        }
      </div>
    );
  }

  private createCategorization(categorization: Categorization, depth = 0) {
    return (
      <ul className={JsonForms.stylingRegistry.getAsClassName('category.subcategories')}>
        {
          categorization.elements.map(category => {
            if (isCategorization(category)) {
              return (
                <li
                  className={JsonForms.stylingRegistry.getAsClassName('category.group')}>
                  <span>{category.label}</span>
                  {
                    this.createCategorization(category as Categorization, depth + 1)
                  }
                </li>
              );
            } else {
              return (
                <li onClick={() => {
                  this.setState({
                    selected: {
                      category
                    }
                  });
                }}
                >
                  <span>{category.label}</span>
                </li>
              );
            }
          })
        }
      </ul>
    );
  }
}

export default JsonForms.rendererService.registerRenderer(
  categorizationTester,
  connect(mapStateToLayoutProps)(CategorizationRenderer)
);

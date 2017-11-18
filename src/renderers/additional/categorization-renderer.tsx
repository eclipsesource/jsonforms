import { JSX } from '../JSX';
import * as _ from 'lodash';
import { JsonForms } from '../../core';
import { Renderer, RendererProps } from '../../core/renderer';
import { and, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Categorization, Category } from '../../models/uischema';
import { mapStateToLayoutProps, registerStartupRenderer } from '../renderer.util';
import DispatchRenderer from '../dispatch-renderer';
import { Component, connect } from '../../common/binding';

const isCategorization = (category: Category | Categorization): category is Categorization => {
  return category.type === 'Categorization';
};

/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
export const categorizationTester: RankedTester = rankWith(
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

export interface CategorizationState {
  selected: {
    category: Category
  };
}

class CategorizationRenderer extends Component<RendererProps, CategorizationState> {

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, visible } = this.props;
    const controlElement = uischema as Categorization;
    const categorization = uischema as Categorization;
    const classNames = JsonForms.stylingRegistry.getAsClassName('categorization');
    const masterClassNames = JsonForms.stylingRegistry.getAsClassName('categorization.master');
    const detailClassNames = JsonForms.stylingRegistry.getAsClassName('categorization.detail');
    const selectedCategory = this.findCategory(controlElement);
    return (
      <div className={classNames}
           hidden={visible === null || visible === undefined ? false : !visible}
      >
        <div className={masterClassNames}>
          {
            this.createCategorization(categorization, selectedCategory)
          }
        </div>
        <div className={detailClassNames}>
          {
            this.renderCategory(selectedCategory)
          }
        </div>
      </div>
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
          (category.elements || []).map(child =>
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
  private getCategoryClassName (category: Category, selectedCategory: Category): string {
    return selectedCategory === category ? 'selected' : '';
  }
  private createCategorization(categorization: Categorization, selectedCategory: Category, depth = 0) {
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
                    this.createCategorization(category, selectedCategory, depth + 1)
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
                }} className={this.getCategoryClassName(category, selectedCategory)}
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

export default registerStartupRenderer(
  categorizationTester,
  connect(mapStateToLayoutProps)(CategorizationRenderer)
);

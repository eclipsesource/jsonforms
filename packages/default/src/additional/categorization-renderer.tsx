import * as _ from 'lodash';
import * as React from 'react';
import {
  and,
  Categorization,
  Category,
  DispatchRenderer,
  JsonForms,
  JsonSchema,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  Renderer,
  RendererProps,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';

const getCategoryClassName = (category: Category, selectedCategory: Category): string =>
  selectedCategory === category ? 'selected' : '';

export interface CategorizationProps {
  categorization: Categorization;
  selectedCategory: Category;
  depth: number;
  onSelect: any;
}

export const CategorizationList  = ({ categorization, selectedCategory, depth, onSelect }: CategorizationProps) =>
  (
    <ul className={JsonForms.stylingRegistry.getAsClassName('category.subcategories')}>
      {
        categorization.elements.map(category => {
          if (isCategorization(category)) {
            return (
              <li
                key={category.label}
                className={JsonForms.stylingRegistry.getAsClassName('category.group')}
              >
                <span>{category.label}</span>
                <CategorizationList categorization={category}
                                    selectedCategory={selectedCategory}
                                    depth={depth + 1}
                                    onSelect={onSelect}
                />
              </li>
            );
          } else {
            return (
              <li
                key={category.label}
                onClick={() => onSelect(category)}
                className={getCategoryClassName(category, selectedCategory)}
              >
                <span>{category.label}</span>
              </li>
            );
          }
        })
      }
    </ul>
  );

export interface SingleCategoryProps {
  category: Category;
  schema: JsonSchema;
  path: string;
}

export const SingleCategory = ({ category, schema, path }: SingleCategoryProps) => (
  // TODO: add selected style
  <div id='categorization.detail'>
    {
      (category.elements || []).map((child, index) =>
          (
            <DispatchRenderer
              key={path + index.toString()}
              uischema={child}
              schema={schema}
              path={path}
            />
          )
      )
    }
  </div>
);

const isCategorization = (category: Category | Categorization): category is Categorization =>
  category.type === 'Categorization';

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
  selectedCategory: Category;
}

class CategorizationRenderer extends Renderer<RendererProps, CategorizationState> {

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, visible } = this.props;
    const categorization = uischema as Categorization;
    const classNames = JsonForms.stylingRegistry.getAsClassName('categorization');
    const masterClassNames = JsonForms.stylingRegistry.getAsClassName('categorization.master');
    const detailClassNames = JsonForms.stylingRegistry.getAsClassName('categorization.detail');
    const selectedCategory = this.findCategory(categorization);

    return (
      <div className={classNames}
           hidden={visible === null || visible === undefined ? false : !visible}
      >
        <div className={masterClassNames}>
          <CategorizationList
            categorization={categorization}
            selectedCategory={selectedCategory}
            depth={0}
            onSelect={ category =>
              this.setState({ selectedCategory: category })
            }
          />
        </div>
        <div className={detailClassNames}>
          <SingleCategory
            category={selectedCategory}
            schema={this.props.schema}
            path={this.props.path}
          />
        </div>
      </div>
    );
  }

  private findCategory(categorization: Categorization):  Category {
    const category = categorization.elements[0];

    if (this.state && this.state.selectedCategory) {
      return this.state.selectedCategory;
    }

    if (isCategorization(category)) {
      return this.findCategory(category);
    }

    return category;
  }
}

export default registerStartupRenderer(
  categorizationTester,
  connect(mapStateToLayoutProps)(CategorizationRenderer)
);

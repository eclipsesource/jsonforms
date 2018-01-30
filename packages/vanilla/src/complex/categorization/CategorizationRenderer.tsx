import * as React from 'react';
import {
  Categorization,
  Category,
  connectToJsonForms,
  mapStateToLayoutProps,
  RendererComponent
} from '@jsonforms/core';
import { CategorizationList } from './CategorizationList';
import { SingleCategory } from './SingleCategory';
import { isCategorization } from './tester';
import { addVanillaLayoutProps } from '../../util';
import { VanillaLayoutProps } from '../../index';

export interface CategorizationState {
  selectedCategory: Category;
}

class CategorizationRenderer extends RendererComponent<VanillaLayoutProps, CategorizationState> {

  onCategorySelected = category => () => {
    return this.setState({selectedCategory: category});
  }

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, visible, getStyleAsClassName  } = this.props;
    const categorization = uischema as Categorization;
    const classNames = getStyleAsClassName('categorization');
    const masterClassNames = getStyleAsClassName('categorization.master');
    const detailClassNames = getStyleAsClassName('categorization.detail');
    const selectedCategory = this.findCategory(categorization);
    const subcategoriesClassName = getStyleAsClassName('category.subcategories');
    const groupClassName = getStyleAsClassName('category.group');

    return (
      <div
        className={classNames}
        hidden={visible === null || visible === undefined ? false : !visible}
      >
        <div className={masterClassNames}>
          <CategorizationList
            categorization={categorization}
            selectedCategory={selectedCategory}
            depth={0}
            onSelect={this.onCategorySelected}
            subcategoriesClassName={subcategoriesClassName}
            groupClassName={groupClassName}
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

const ConnectedCategorizationRenderer = connectToJsonForms(
  addVanillaLayoutProps(mapStateToLayoutProps),
  null
)(CategorizationRenderer);
export default ConnectedCategorizationRenderer;

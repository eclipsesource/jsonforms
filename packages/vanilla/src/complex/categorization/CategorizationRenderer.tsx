import * as React from 'react';
import { connect } from 'react-redux';
import {
  Categorization,
  Category,
  Renderer,
} from '@jsonforms/core';
import { CategorizationList } from './CategorizationList';
import { SingleCategory } from './SingleCategory';
import { isCategorization } from './tester';
import { mapStateToVanillaLayoutProps, VanillaRendererProps } from '../../util';

export interface CategorizationState {
  selectedCategory: Category;
}

class CategorizationRenderer extends Renderer<VanillaRendererProps, CategorizationState> {

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
            config={this.props.config}
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

export default connect(mapStateToVanillaLayoutProps)(CategorizationRenderer);

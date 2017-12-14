import * as React from 'react';
import { connect } from 'react-redux';
import {
  Categorization,
  Category,
  JsonForms,
  mapStateToLayoutProps,
  Renderer,
  RendererProps,
} from '@jsonforms/core';
import { CategorizationList } from './CategorizationList';
import { SingleCategory } from './SingleCategory';
import { isCategorization } from './tester';

export interface CategorizationState {
  selectedCategory: Category;
}

class CategorizationRenderer extends Renderer<RendererProps, CategorizationState> {

  onCategorySelected = (category) => () => {
    console.log('setting selected category', category);
    return this.setState({selectedCategory: category});
  }

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

export default connect(mapStateToLayoutProps)(CategorizationRenderer);

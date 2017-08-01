import * as _ from 'lodash';
import { Renderer } from '../../core/renderer';
import { Runtime, RUNTIME_TYPE } from '../../core/runtime';
import { and, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { JsonFormsElement } from '../../json-forms';
import { Categorization, Category } from '../../models/uischema';
import { JsonFormsRenderer } from '../renderer.util';
import { JsonForms } from '../../core';

const isCategorization = (category: Category | Categorization): category is Categorization => {
  return category.type === 'Categorization';
};

/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
export const categorizationTester: RankedTester =
    rankWith(
        1,
        and(
            uiTypeIs('Categorization'),
            uiSchema => {
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

              return hasCategory(uiSchema as Categorization);
            }
        ));

/**
 * Default renderer for a categorization.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-categorization',
  tester: categorizationTester
})
export class CategorizationRenderer extends Renderer {
  private master: HTMLElement;
  private detail: HTMLElement;
  private selected: HTMLLIElement;

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  dispose(): void {
    // Do nothing
  }

  /**
   * @inheritDoc
   */
  runtimeUpdated(type: RUNTIME_TYPE): void {
    const runtime = this.uischema.runtime as Runtime;
    switch (type) {
      case RUNTIME_TYPE.VISIBLE:
        this.hidden = !runtime.visible;
        break;
      case RUNTIME_TYPE.ENABLED:
        if (!runtime.enabled) {
          this.setAttribute('disabled', 'true');
        } else {
          this.removeAttribute('disabled');
        }
        break;
      default:
    }
  }

  /**
   * @inheritDoc
   */
  render(): HTMLElement {
    this.className = JsonForms.stylingRegistry.getAsClassName('categorization');

    this.master = document.createElement('div');
    this.master.className = JsonForms.stylingRegistry.getAsClassName('categorization.master');
    this.appendChild(this.master);

    this.detail = document.createElement('div');
    this.detail.className = JsonForms.stylingRegistry.getAsClassName('categorization.detail');
    this.appendChild(this.detail);

    this.renderFull();

    return this;
  }

  private renderFull() {
    this.renderMaster();
    const controlElement = this.uischema as Categorization;
    const result = this.findFirstCategory(
        controlElement,
        this.master.firstChild as HTMLUListElement
    );
    this.renderDetail(result.category, result.li);
  }

  private findFirstCategory(categorization: Categorization, parent: HTMLUListElement):
    {category: Category, li: HTMLLIElement} {

    const category = categorization.elements[0];
    if (isCategorization(category)) {
      return this.findFirstCategory(category, parent.firstChild.lastChild as HTMLUListElement);
    }

    return {category: category, li: parent.firstChild as HTMLLIElement};
  }

  private renderMaster() {
    const categorization = this.uischema as Categorization;
    const ul = this.createCategorizationList(categorization);
    this.master.appendChild(ul);
  }

  private createCategorizationList(categorization: Categorization): HTMLUListElement {
    const ul = document.createElement('ul');
    categorization.elements.forEach(category => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = category.label;
      li.appendChild(span);
      // const div = document.createElement('div');
      // div.className = 'jsf-category-entry';
      // const span = document.createElement('span');
      // span.className = 'jsf-category-label';
      // span.innerText
      if (isCategorization(category)) {
        const innerUl = this.createCategorizationList(category);
        innerUl.className = JsonForms.stylingRegistry.getAsClassName('category.subcategories');
        li.className = JsonForms.stylingRegistry.getAsClassName('category.group');
        li.appendChild(innerUl);
      } else {
        li.onclick = (ev: Event) => {
          this.renderDetail(category, li);
        };
      }
      ul.appendChild(li);
    });

    return ul;
  }

  private renderDetail(category: Category, li: HTMLLIElement) {
    if (this.detail.lastChild !== null) {
      this.detail.removeChild(this.detail.lastChild);
    }
    if (this.selected !== undefined) {
      this.selected.classList.toggle('selected');
    }
    li.classList.toggle('selected');
    this.selected = li;

    const wrapper = document.createElement('div');
    if (category.elements !== undefined && category.elements !== null) {
      category.elements.forEach(child => {
        const jsonForms = document.createElement('json-forms') as JsonFormsElement;
        jsonForms.data = this.dataService.getValue({scope: {$ref: '#'}});
        jsonForms.uiSchema = child;
        jsonForms.dataSchema = this.dataSchema;
        wrapper.appendChild(jsonForms);
      });
    }
    this.detail.appendChild(wrapper);
  }
}

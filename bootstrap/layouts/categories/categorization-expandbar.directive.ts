import {CategorizationController} from
  '../../../src/components/renderers/layouts/categories/categorization.directive';
import {Testers, uiTypeIs, optionIs} from '../../../src/components/renderers/testers';
class CategorizationExpandbarDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-layout>
        <div class="row">
            <!-- Master -->
            <div class="col-sm-30 jsf-masterdetail">
                <uib-accordion>
                    <uib-accordion-group heading="{{categorization.label}}"
                        ng-repeat="categorization in vm.uiSchema.elements">
                        <div ng-repeat="category in categorization.elements"
                            ng-click="vm.changeSelectedCategory(category)">
                            <span ng-bind="category.label" style="cursor:pointer"></span>
                        </div>
                    </uib-accordion-group>
                </uib-accordion>
            </div>
            <!-- Detail -->
            <div class="col-sm-70" >
                <fieldset ng-if="vm.selectedCategory">
                    <jsonforms-inner ng-repeat="child in vm.selectedCategory.elements"
                        uischema="child"></jsonforms-inner>
                </fieldset>
            </div>
        </div>
    </jsonforms-layout>
    `;
    controller = CategorizationController;
    controllerAs = 'vm';
}
export default angular
    .module('jsonforms-bootstrap.renderers.layouts.categories.expandbar',
      ['jsonforms.renderers.layouts'])
    .directive('categorizationExpandbarElement', () => new CategorizationExpandbarDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('categorization-expandbar-element',
          Testers.and(uiTypeIs('Categorization'), optionIs('expandbar', true)), 3)
    ])
    .name;

import {AbstractLayout} from '../abstract-layout';
import {uiTypeIs} from '../../testers';

class CategorizationDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'categorization.html';
    controller = CategorizationController;
    controllerAs = 'vm';
}
export class CategorizationController  extends AbstractLayout {
    static $inject = ['$scope'];
    private selectedCategory;
    constructor(scope: ng.IScope) {
        super(scope);
    }
    public changeSelectedCategory(category, clickScope) {
      if (category.type === 'Category') {
        this.selectedCategory = category;
      } else {
        clickScope.expanded = !clickScope.expanded;
        if (!clickScope.expanded) {
          this.selectedCategory = null;
        }
      }
    }
}

const categorizationTemplate = `
<script type="text/ng-template" id="category.html">
  <ul>
      <li ng-repeat="category in categorization.elements" ng-init="expanded=false"
        ng-class="{
          'closed': !expanded && category.type==='Categorization',
          'expanded': expanded && category.type==='Categorization',
          'none': category.type==='Category'
        }">
          <div class="jsf-category-entry">
            <span class="jsf-category-label"
                  ng-class="{'selected': category===vm.selectedCategory}"
                  ng-click="vm.changeSelectedCategory(category,this)">
                  {{category.label}}
            </span>
          </div>
          <div class="jsf-category-subcategories" ng-init="categorization=category"
           ng-if="category.type==='Categorization'" ng-show="expanded" ng-include="'category.html'">
          </div>
      </li>
  </ul>
</script>
<jsonforms-layout>
    <div class="jsf-categorization">
        <div class="jsf-categorization-master" ng-include="'category.html'"
          ng-init="categorization=vm.uiSchema">
        </div>
        <div class="jsf-categorization-detail">
            <jsonforms-inner ng-if="vm.selectedCategory"
                             ng-repeat="child in vm.selectedCategory.elements"
                             uischema="child">
             </jsonforms-inner>
        </div>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms.renderers.layouts.categories', ['jsonforms.renderers.layouts'])
    .directive('categorization', () => new CategorizationDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('categorization',  uiTypeIs('Categorization'), 2)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;

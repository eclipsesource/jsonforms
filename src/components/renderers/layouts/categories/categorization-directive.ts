import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';

class CategorizationDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'categorization.html';
    controller = CategorizationController;
    controllerAs = 'vm';
}
interface CategorizationControllerScope extends ng.IScope {
}
class CategorizationController  extends AbstractLayout {
    static $inject = ['$scope'];
    private selectedCategory;
    constructor(scope: CategorizationControllerScope) {
        super(scope);
    }
    public changeSelectedCategory(category) {
        this.selectedCategory = category;
    }
}

const categorizationTemplate = `<jsonforms-layout>
    <div class="jsf-categorization">
        <div class="jsf-categorization-master">
            <ul>
                <li ng-repeat="category in vm.uiSchema.elements" ng-click="vm.changeSelectedCategory(category)">
                    <span class="jsf-category-entry" ng-class="{'selected': category===vm.selectedCategory}">{{category.label}}</span>
                </li>
            </ul>
        </div>
        <fieldset class="jsf-categorization-detail">
            <jsonforms-inner ng-if="vm.selectedCategory" ng-repeat="child in vm.selectedCategory.elements" uischema="child"></jsonforms-inner>
        </fieldset>
    </div>
</jsonforms-layout>`;

const CategorizationLayoutRendererTester: RendererTester = function(element: IUISchemaElement,
                                                                  dataSchema: any,
                                                                  dataObject: any,
                                                                  pathResolver: IPathResolver ){
    if (element.type !== 'Categorization') {
        return NOT_FITTING;
    }
    return 2;
};
export default angular
    .module('jsonforms.renderers.layouts.categories', ['jsonforms.renderers.layouts'])
    .directive('categorization', () => new CategorizationDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('categorization', CategorizationLayoutRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;

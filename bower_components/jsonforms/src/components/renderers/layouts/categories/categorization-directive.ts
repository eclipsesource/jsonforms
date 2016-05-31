import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';

class CategorizationDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-layout>        
         <div class="row jsf-categorization">
              <div class="col-sm-100">
                   <uib-tabset>
                        <uib-tab
                            heading="{{category.label}}"
                            ng-repeat="category in vm.uiSchema.elements"
                            select="vm.changeSelectedCategory(category)">
                            <fieldset ng-if="vm.selectedCategory===category">
                                <jsonforms-inner ng-repeat="child in category.elements"
                                                 ui-schema="child" >
                                </jsonforms-inner>
                            </fieldset>
                        </uib-tab>
                   </uib-tabset>
               </div>
         </div>
    </jsonforms-layout>`;
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
    .name;

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
        $templateCache.put('categorization.html', require('./categorization.html'));
    }])
    .name;

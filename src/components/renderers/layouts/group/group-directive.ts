require('./group.css');
import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';
class GroupDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'group.html';
    controller = GroupController;
    controllerAs = 'vm';
}
interface GroupControllerScope extends ng.IScope {
}
class GroupController  extends AbstractLayout {
    static $inject = ['$scope'];
    constructor(scope: GroupControllerScope) {
        super(scope);
    }
    private get label() {
        return this.uiSchema.label ? this.uiSchema.label : '';
    }
}
const GroupLayoutRendererTester: RendererTester = function(element: IUISchemaElement,
                                                         dataSchema: any,
                                                         dataObject: any,
                                                         pathResolver: IPathResolver ){
    if (element.type !== 'Group') {
        return NOT_FITTING;
    }
    return 2;
};

export default angular
    .module('jsonforms.renderers.layouts.group', ['jsonforms.renderers.layouts'])
    .directive('grouplayout', () => new GroupDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('grouplayout', GroupLayoutRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('group.html', require('./group.html'));
    }])
    .name;

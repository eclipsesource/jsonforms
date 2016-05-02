require('./group.css');
import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';
class GroupDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-layout class="jsf-group">
        <fieldset class="row">
            <legend ng-if="vm.label">{{vm.label}}</legend>
            <jsonforms-inner ng-repeat="child in vm.uiSchema.elements" 
                             ui-schema="child" 
                             class="col-sm-100">                             
            </jsonforms-inner>
        </fieldset>
    </jsonforms-layout>`;
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
    .name;

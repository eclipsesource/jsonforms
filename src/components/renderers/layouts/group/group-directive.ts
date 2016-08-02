import {AbstractLayout} from '../abstract-layout';
import {uiTypeIs} from '../../testers';

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

const groupTemplate = `<jsonforms-layout>
    <div class="jsf-group">
        <fieldset>
            <legend ng-if="vm.label">{{vm.label}}</legend>
            <jsonforms-inner ng-repeat="child in vm.uiSchema.elements"
                             uischema="child">
            </jsonforms-inner>
         </fieldset>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms.renderers.layouts.group', ['jsonforms.renderers.layouts'])
    .directive('grouplayout', () => new GroupDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('grouplayout', uiTypeIs('Group'), 2)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('group.html', groupTemplate);
    }])
    .name;

import {HorizontalController} from
    '../../../src/components/renderers/layouts/horizontal/horizontal.directive';
import {uiTypeIs} from '../../../src/components/renderers/testers';

class BootstrapHorizontalDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'horizontal.html';
    controller = BootstrapHorizontalController;
    controllerAs = 'vm';
}
interface BootstrapHorizontalControllerScope extends ng.IScope {
}
class BootstrapHorizontalController extends HorizontalController {
    static $inject = ['$scope'];

    constructor(scope: BootstrapHorizontalControllerScope) {
        super(scope);
    }
    private get size(){
        return 100;
    }
    private get childSize(){
        return Math.floor(this.size / this.uiSchema.elements.length);
    }
}

const horizontalTemplate = `<jsonforms-layout class="jsf-horizontal-layout">
    <div class="jsf-horizontal-layout">
        <div class="row">
            <div ng-repeat="child in vm.uiSchema.elements" class="col-sm-{{vm.childSize}}">
                <jsonforms-inner uischema="child"></jsonforms-inner>
            </div>
        </div>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-bootstrap.renderers.layouts.horizontal',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .directive('horizontalBootstrapLayout', () => new BootstrapHorizontalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('horizontal-bootstrap-layout', uiTypeIs('HorizontalLayout'), 3)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;

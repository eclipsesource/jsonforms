import {AbstractLayout} from '../abstract-layout';
import {uiTypeIs} from '../../testers';

class VerticalDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'vertical.html';
    controller = VerticalController;
    controllerAs = 'vm';
}
interface VerticalControllerScope extends ng.IScope {
}
class VerticalController extends AbstractLayout {
    static $inject = ['$scope'];
    constructor(scope: VerticalControllerScope) {
        super(scope);
    }
}

const verticalTemplate = `
<jsonforms-layout>
    <div class="jsf-vertical-layout">
        <div class="jsf-vertical-layout-container">        
            <div ng-repeat="child in vm.uiSchema.elements">
                <jsonforms-inner uischema="child"></jsonforms-inner>
            </div>
        </div>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts'])
    .directive('verticallayout', () => new VerticalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('verticallayout', uiTypeIs('VerticalLayout'), 2)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;

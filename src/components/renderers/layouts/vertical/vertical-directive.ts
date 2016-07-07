import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';

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
const VerticalLayoutRendererTester: RendererTester = function(element: IUISchemaElement,
                                                            dataSchema: any,
                                                            dataObject: any,
                                                            pathResolver: IPathResolver ){
    if (element.type !== 'VerticalLayout') {
        return NOT_FITTING;
    }
    return 2;
};

const verticalTemplate = `
<jsonforms-layout>
    <div class="jsf-vertical-layout">
        <fieldset class="jsf-vertical-layout-container">
            <div ng-repeat="child in vm.uiSchema.elements">
                <jsonforms-inner uischema="child"></jsonforms-inner>
            </div>
        </fieldset>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts'])
    .directive('verticallayout', () => new VerticalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('verticallayout', VerticalLayoutRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;

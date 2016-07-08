import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {LabelObjectUtil} from '../../controls/abstract-control';
import {IUISchemaElement} from '../../../../uischema';


class HorizontalDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'horizontal.html';
    controller = HorizontalController;
    controllerAs = 'vm';
}
export interface HorizontalControllerScope extends ng.IScope {
}
export class HorizontalController  extends AbstractLayout {
    static $inject = ['$scope'];

    constructor(scope: HorizontalControllerScope) {
        super(scope);
        this.updateChildrenLabel(this.uiSchema.elements);
    }
    private updateChildrenLabel(elements: IUISchemaElement[]): void {
        let labelExists = elements.reduce((atLeastOneLabel, element) => {
            return atLeastOneLabel ||  LabelObjectUtil.shouldShowLabel(element.label);
        }, false);
        if (labelExists) {
            elements.forEach(element => {
                let showElementLabel = LabelObjectUtil.shouldShowLabel(element.label);
                if (!showElementLabel) {
                    element.label = {show: true, text: ''};
                }
            });
        }
    }
}
const HorizontalLayoutRendererTester: RendererTester = function(element: IUISchemaElement,
                                                                dataSchema: any,
                                                                dataObject: any,
                                                                pathResolver: IPathResolver ) {
    if (element.type !== 'HorizontalLayout') {
        return NOT_FITTING;
    }
    return 2;
};

const horizontalTemplate = `<jsonforms-layout>
    <div class="jsf-horizontal-layout">
        <fieldset>
            <div class="jsf-horizontal-layout-container">
                <div ng-repeat="child in vm.uiSchema.elements">
                    <jsonforms-inner uischema="child"></jsonforms-inner>
                </div>
            </div>
        </fieldset>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms.renderers.layouts.horizontal', ['jsonforms.renderers.layouts'])
    .directive('horizontallayout', () => new HorizontalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('horizontallayout', HorizontalLayoutRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;

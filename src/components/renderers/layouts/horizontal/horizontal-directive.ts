import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../uischema';
import {uiTypeIs} from '../../testers';
import {LabelObjectUtil} from '../../Labels';


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
            return atLeastOneLabel ||  LabelObjectUtil.shouldShowLabel(element);
        }, false);
        if (labelExists) {
            elements.forEach(element => {
                let showElementLabel = LabelObjectUtil.shouldShowLabel(element);
                if (!showElementLabel) {
                    element.label = {show: true, text: ''};
                }
            });
        }
    }
}

const horizontalTemplate = `<jsonforms-layout>
    <div class="jsf-horizontal-layout">
         <div class="jsf-horizontal-layout-container">
              <div ng-repeat="child in vm.uiSchema.elements">
                   <jsonforms-inner uischema="child"></jsonforms-inner>
              </div>
         </div>
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms.renderers.layouts.horizontal', ['jsonforms.renderers.layouts'])
    .directive('horizontallayout', () => new HorizontalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('horizontallayout', uiTypeIs('HorizontalLayout'), 2)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;

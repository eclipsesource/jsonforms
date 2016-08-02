
import {uiTypeIs} from '../../testers';
class LabelDirective implements ng.IDirective {
    restrict = 'E';
    template = `<jsonforms-widget class="jsf-label">{{vm.text}}<hr></jsonforms-widget>`;
    controller = LabelController;
    controllerAs = 'vm';
}
interface LabelControllerScope extends ng.IScope {
}
class LabelController {
    static $inject = ['$scope'];
    private text: string;
    constructor(private scope: LabelControllerScope) {
        this.text = scope['uischema']['text'];
    }
    private get size() {
        return 100;
    }
}

export default angular
    .module('jsonforms.renderers.extras.label', ['jsonforms.renderers'])
    .directive('labelControl', () => new LabelDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('label-control', uiTypeIs('Label'), 2)
    ])
    .name;

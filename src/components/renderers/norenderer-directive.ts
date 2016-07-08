import {IUISchemaElement} from '../../uischema';

class NoRendererDirective implements ng.IDirective {
    restrict = 'E';
    template = `
        <div style="display:none">
            <span>No Renderer for {{vm.uischema.type}}.</span>
            <span>Full element: {{vm.uischema}}.</span>
        </div>
    `;
    controller = NoRendererController;
    controllerAs = 'vm';
}
class NoRendererController {
    static $inject = ['$scope'];
    private uischema: IUISchemaElement;
    constructor(private scope: ng.IScope) {
        this.uischema = scope['uischema'];
    }
}
export default angular
    .module('jsonforms.renderers.norenderer', [])
    .directive('norenderer', () => new NoRendererDirective())
    .name;

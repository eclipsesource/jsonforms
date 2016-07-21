import {AbstractControl, uiTypeIs} from '../abstract-control';
import {PathResolver} from "../../../services/pathresolver/jsonforms-pathresolver";

class ReferenceDirective implements ng.IDirective {
    restrict = 'E';
    template = `<div>{{vm.prefix}} <a href="{{vm.link}}">{{vm.linkText}}</a></div>`;
    controller = ReferenceController;
    controllerAs = 'vm';
}
interface ReferenceControllerScope extends ng.IScope {
}
class ReferenceController extends AbstractControl {
    static $inject = ['$scope'];
    constructor(scope: ReferenceControllerScope) {
        super(scope);
    }
    public get link(){
        let normalizedPath = PathResolver.toInstancePath(this.schemaPath);
        return '#' + this.uiSchema['href']['url'] + '/' + this.data[normalizedPath];
    };
    public get linkText(){
        return this.uiSchema['href']['label'] ? this.uiSchema['href']['label'] : this.label;
    }
    public get prefix(){
        return this.uiSchema.label ? this.uiSchema.label : 'Go to';
    }
}

export default angular
    .module('jsonforms.renderers.controls.reference', ['jsonforms.renderers.controls'])
    .directive('referenceControl', () => new ReferenceDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('reference-control', uiTypeIs('ReferenceControl'), 2)
    ])
    .name;

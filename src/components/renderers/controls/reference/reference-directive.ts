import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl} from '../abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';

class ReferenceDirective implements ng.IDirective {
    restrict = 'E';
    template = `<div>{{vm.prefix}} <a href="{{vm.link}}">{{vm.linkText}}</a></div>`;
    controller = ReferenceController;
    controllerAs = 'vm';
}
interface ReferenceControllerScope extends ng.IScope {
}
class ReferenceController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: ReferenceControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
    public get link(){
        let normalizedPath = this.pathResolver.toInstancePath(this.schemaPath);
        return '#' + this.uiSchema['href']['url'] + '/' + this.data[normalizedPath];
    };
    public get linkText(){
        return this.uiSchema['href']['label'] ? this.uiSchema['href']['label'] : this.label;
    }
    public get prefix(){
        return this.uiSchema.label ? this.uiSchema.label : 'Go to';
    }
}
const ReferenceControlRendererTester: RendererTester = function(element: IUISchemaElement,
                                                                dataSchema: any,
                                                                dataObject: any,
                                                                pathResolver: IPathResolver ){
    if (element.type !== 'ReferenceControl') {
        return NOT_FITTING;
    }
    return 2;
};

export default angular
    .module('jsonforms.renderers.controls.reference', ['jsonforms.renderers.controls'])
    .directive('referenceControl', () => new ReferenceDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('reference-control', ReferenceControlRendererTester)
    ])
    .name;

import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';
class ReferenceDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `<div>{{vm.prefix}} <a href="{{vm.link}}">{{vm.linkText}}</a></div>`;
    controller = ReferenceController;
    controllerAs = 'vm';
}
interface ReferenceControllerScopepe extends ng.IScope {
}
class ReferenceController extends AbstractControl {
    static $inject = ['$scope','PathResolver'];
    constructor(scope:ReferenceControllerScopepe,refResolver: IPathResolver) {
        super(scope,refResolver);
    }
    private get link(){
        let normalizedPath = this.pathResolver.toInstancePath(this.schemaPath);
        return "#"+this.uiSchema['href']['url']+"/"+this.data[normalizedPath];
    };
    private get linkText(){
        return this.uiSchema['href']['label'] ? this.uiSchema['href']['label'] : this.label;;
    }
    private get prefix(){
        return this.uiSchema.label ? this.uiSchema.label : "Go to ";
    }
}
var ReferenceControlRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='ReferenceControl')
        return NOT_FITTING;
    return 2;
}

export default angular
    .module('jsonforms.renderers.controls.reference',['jsonforms.renderers.controls'])
    .directive('referenceControl', () => new ReferenceDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("reference-control",ReferenceControlRendererTester);
        }
    ])
    .name;

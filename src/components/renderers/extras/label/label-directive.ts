import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
class LabelDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-widget class="jsf-label">{{vm.text}}<hr></jsonforms-widget>`;
    controller = LabelController;
    controllerAs = 'vm';
}
interface LabelControllerScope extends ng.IScope {
}
class LabelController {
    static $inject = ['$scope'];
    private text:string;
    constructor(private scope: LabelControllerScope) {
        this.text = scope['uiSchema']['text'];
    }
    private get size(){
        return 100;
    }
}
var LabelControlRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='Label')
        return NOT_FITTING;
    return 2;
}

export default angular
    .module('jsonforms.renderers.extras.label', ['jsonforms.renderers'])
    .directive('labelControl', () => new LabelDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("label-control",LabelControlRendererTester);
        }
    ])
    .name;

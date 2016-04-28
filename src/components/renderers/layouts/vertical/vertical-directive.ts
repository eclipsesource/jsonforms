import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';
class VerticalDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <div ng-show='vm.uiSchema.elements.length'>
        <jsonforms-layout class="jsf-vertical-layout">
            <jsonforms-inner ng-repeat="child in vm.uiSchema.elements" ui-schema="child"></jsonforms-inner>
        </jsonforms-layout>
    </div>`;
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
    private get size(){
        return 100;
    }
}
var VerticalLayoutRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='VerticalLayout')
        return NOT_FITTING;
    return 2;
}

export default angular
    .module('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts'])
    .directive('verticallayout', () => new VerticalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register("verticallayout",VerticalLayoutRendererTester)
    ])
    .name;

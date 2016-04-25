import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
class GroupDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-layout class="jsf-group">
        <fieldset>
            <legend ng-if="vm.label">{{vm.label}}</legend>
            <jsonforms-inner ng-repeat="child in vm.uiSchema.elements" ui-schema="child"></jsonforms-inner>
        </fieldset>
    </jsonforms-layout>`;
    controller = GroupController;
    controllerAs = 'vm';
}
interface GroupControllerScope extends ng.IScope {
}
class GroupController  extends AbstractLayout{
    static $inject = ['$scope'];
    constructor(scope: GroupControllerScope) {
        super(scope);
    }
    private get size(){
        return 100;
    }
    private get label(){
        return this.uiSchema.label ? this.uiSchema.label : "";
    }
}
var GroupLayoutRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='Group')
        return NOT_FITTING;
    return 2;
}

export default angular
    .module('jsonforms.renderers.layouts.group', ['jsonforms.renderers.layouts'])
    .directive('grouplayout', () => new GroupDirective())
    .run(['RendererService', RendererService =>
        RendererService.register("grouplayout",GroupLayoutRendererTester)
    ])
    .name;

import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
class HorizontalDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-layout class="jsf-horizontal-layout">
      <fieldset>
        <div class="row">
            <div ng-repeat="child in vm.uiSchema.elements" class="col-sm-{{vm.childSize}}">
                <jsonforms-inner ui-schema="child"></jsonforms-inner>
            </div>
        </div>
      </fieldset>
    </jsonforms-layout>
    `;
    controller = HorizontalController;
    controllerAs = 'vm';
}
interface HorizontalControllerScope extends ng.IScope {
}
class HorizontalController  extends AbstractLayout {
    static $inject = ['$scope'];

    constructor(scope: HorizontalControllerScope) {
        super(scope);
    }
    private get size(){
        return 100;
    }
    private get childSize(){
        return Math.floor(this.size / this.uiSchema.elements.length);
    }
}
var HorizontalLayoutRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='HorizontalLayout')
        return NOT_FITTING;
    return 2;
}

export default angular
    .module('jsonforms.renderers.layouts.horizontal')
    .directive('horizontallayout', () => new HorizontalDirective())
    .run(['RendererService', RendererService =>
        RendererService.register("horizontallayout",HorizontalLayoutRendererTester)
    ])
    .name;

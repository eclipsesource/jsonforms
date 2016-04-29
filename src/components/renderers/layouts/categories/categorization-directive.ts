import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractLayout} from '../abstract-layout';
import {IUISchemaElement} from '../../../../jsonforms';
class CategorizationDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-layout>
        <div class="row">
            <div class="col-sm-100">
                <tabset>
                    <tab heading="{{category.label}}" ng-repeat="category in vm.uiSchema.elements">
                        <fieldset>
                            <jsonforms-inner ng-repeat="child in category.elements" ui-schema="child" ></jsonforms-inner>
                        </fieldset>
                    </tab>
                </tabset>
            </div>
        </div>
    </jsonforms-layout>`;
    controller = CategorizationController;
    controllerAs = 'vm';
}
interface CategorizationControllerScope extends ng.IScope {
}
class CategorizationController  extends AbstractLayout{
    static $inject = ['$scope'];
    constructor(scope: CategorizationControllerScope) {
        super(scope);
    }
}
var CategorizationLayoutRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='Categorization')
        return NOT_FITTING;
    return 2;
}
export  default angular
    .module('jsonforms.renderers.layouts.categories', ['jsonforms.renderers.layouts'])
    .directive('categorization', () => new CategorizationDirective())
    .run(['RendererService', RendererService =>
        RendererService.register("categorization",CategorizationLayoutRendererTester)
    ])
    .name;

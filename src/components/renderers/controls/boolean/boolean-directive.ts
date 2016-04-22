import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
class BooleanDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-control>
      <input type="checkbox" id="{{vm.id}}" class="jsf-control-boolean" ng-model="vm.modelValue[vm.fragment]" ng-change='vm.modelChanged()'/>
    </jsonforms-control>`;
    controller = BooleanController;
    controllerAs = 'vm';
}
interface BooleanControllerScope extends ng.IScope {
}
class BooleanController extends AbstractControl {
    static $inject = ['$scope','PathResolver'];
    constructor(scope: BooleanControllerScope,refResolver: IPathResolver) {
        super(scope,refResolver);
    }
}
var BooleanControlRendererTester: RendererTester = ControlRendererTester('boolean',1);

export default angular
    .module('jsonforms.renderers.controls.boolean')
    .directive('booleanControl', () => new BooleanDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("boolean-control",BooleanControlRendererTester);
        }
    ])
    .name;

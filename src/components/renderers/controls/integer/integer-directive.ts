import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
class IntegerDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-control>
      <input type="number" step="1" id="{{vm.id}}" class="form-control jsf-control-integer" ng-model="vm.modelValue[vm.fragment]" ng-change='vm.modelChanged()'/>
    </jsonforms-control>`;
    controller = IntegerController;
    controllerAs = 'vm';
}
interface IntegerControllerScope extends ng.IScope {
}
class IntegerController extends AbstractControl {
    static $inject = ['$scope','PathResolver'];
    constructor(scope: IntegerControllerScope,refResolver: IPathResolver) {
        super(scope,refResolver);
    }
}
var IntegerControlRendererTester: RendererTester = ControlRendererTester('integer',1);

export default angular
    .module('jsonforms.renderers.controls.integer')
    .directive('integerControl', () => new IntegerDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("integer-control",IntegerControlRendererTester);
        }
    ])
    .name;

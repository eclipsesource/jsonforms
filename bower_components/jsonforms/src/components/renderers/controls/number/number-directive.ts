import {RendererTester} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
class NumberDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-control>
      <input type="number" 
             step="0.01" 
             id="{{vm.id}}" 
             class="form-control jsf-control-number" 
             ng-model="vm.modelValue[vm.fragment]" 
             ng-change='vm.modelChanged()' 
             ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = NumberController;
    controllerAs = 'vm';
}
interface NumberControllerScopepe extends ng.IScope {
}
class NumberController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: NumberControllerScopepe, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
}
const NumberControlRendererTester: RendererTester = ControlRendererTester('number', 1);

export default angular
    .module('jsonforms.renderers.controls.number', ['jsonforms.renderers.controls'])
    .directive('numberControl', () => new NumberDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('number-control', NumberControlRendererTester)
    ])
    .name;

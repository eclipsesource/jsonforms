import {RendererTester} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';

class IntegerDirective implements ng.IDirective {
    template = `
    <jsonforms-control>
      <input type="number" 
             step="1" 
             id="{{vm.id}}" 
             class="form-control jsf-control-integer" 
             ng-model="vm.modelValue[vm.fragment]" 
             ng-change='vm.modelChanged()' 
             ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = IntegerController;
    controllerAs = 'vm';
}
interface IntegerControllerScope extends ng.IScope {
}
class IntegerController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: IntegerControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
}
const IntegerControlRendererTester: RendererTester = ControlRendererTester('integer', 1);

export default angular
    .module('jsonforms.renderers.controls.integer', ['jsonforms.renderers.controls'])
    .directive('integerControl', () => new IntegerDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('integer-control', IntegerControlRendererTester)
    ])
    .name;

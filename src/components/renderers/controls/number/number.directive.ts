import {AbstractControl} from '../abstract-control';
import {schemaTypeIs} from '../../testers';

const numberTemplate = `<jsonforms-control>
      <input type="number" 
             step="0.01" 
             id="{{vm.id}}" 
             class="form-control jsf-control-number" 
             ng-model="vm.resolvedData[vm.fragment]" 
             ng-change='vm.triggerChangeEvent()' 
             ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`

class NumberDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'number.html';
    controller = NumberController;
    controllerAs = 'vm';
}
interface NumberControllerScope extends ng.IScope {
}
class NumberController extends AbstractControl {
    static $inject = ['$scope'];
    constructor(scope: NumberControllerScope) {
        super(scope);
    }
}

export default angular
    .module('jsonforms.renderers.controls.number', ['jsonforms.renderers.controls'])
    .directive('numberControl', () => new NumberDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('number-control', schemaTypeIs('number'), 1)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('number.html', numberTemplate);
    }])
    .name;

import {AbstractControl} from '../abstract-control';
import {Testers, schemaTypeIs, uiTypeIs} from '../../testers';

const integerTemplate = `<jsonforms-control>
      <input type="number" 
             step="1" 
             id="{{vm.id}}" 
             class="form-control jsf-control-integer" 
             ng-model="vm.resolvedData[vm.fragment]" 
             ng-change='vm.triggerChangeEvent()' 
             ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;

class IntegerDirective implements ng.IDirective {
    templateUrl = 'integer.html';
    controller = IntegerController;
    controllerAs = 'vm';
}
interface IntegerControllerScope extends ng.IScope {
}
class IntegerController extends AbstractControl {
    static $inject = ['$scope'];
    constructor(scope: IntegerControllerScope) {
        super(scope);
    }
}

export default angular
    .module('jsonforms.renderers.controls.integer', ['jsonforms.renderers.controls'])
    .directive('integerControl', () => new IntegerDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('integer-control',
                Testers.and(
                    schemaTypeIs('integer'),
                    uiTypeIs('Control')
                ), 1)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('integer.html', integerTemplate);
    }])
    .name;

import {AbstractControl} from '../abstract-control';
import {schemaTypeIs} from '../../testers';

class BooleanDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'boolean.html';
    controller = BooleanController;
    controllerAs = 'vm';
}
interface BooleanControllerScope extends ng.IScope {
}

class BooleanController extends AbstractControl {
    static $inject = ['$scope'];
    constructor(scope: BooleanControllerScope) {
        super(scope);
    }
}

const booleanTemplate = `<jsonforms-control>
  <input type="checkbox"
         id="{{vm.id}}"
         class="jsf-control-boolean"
         ng-model="vm.resolvedData[vm.fragment]"
         ng-change='vm.triggerChangeEvent()'
         ng-disabled="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

export default angular
    .module('jsonforms.renderers.controls.boolean', ['jsonforms.renderers.controls'])
    .directive('booleanControl', () => new BooleanDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('boolean-control', schemaTypeIs('boolean'), 1)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('boolean.html', booleanTemplate);
    }])
    .name;

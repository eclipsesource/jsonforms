import {AbstractControl, Testers, uiTypeIs, schemaTypeMatches} from '../abstract-control';

class EnumDirective implements ng.IDirective {
    restrict = 'E';
    template = `<jsonforms-control>
      <select ng-options="option as option for option in vm.options"
              id="{{vm.id}}"
              class="form-control jsf-control-enum" 
              ng-change='vm.triggerChangeEvent()'
              ng-model="vm.resolvedData[vm.fragment]"
              ng-readonly="vm.uiSchema.readOnly">
      </select>
    </jsonforms-control>`;
    controller = EnumController;
    controllerAs = 'vm';
}

interface EnumControllerScope extends ng.IScope {
}

class EnumController extends AbstractControl {
    static $inject = ['$scope'];
    constructor(scope: EnumControllerScope) {
        super(scope);
    }

    private get options(){
        return this.resolvedSchema.enum;
    }
}

export default angular
    .module('jsonforms.renderers.controls.enum', ['jsonforms.renderers.controls'])
    .directive('enumControl', () => new EnumDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('enum-control',
                Testers.and(
                    uiTypeIs('Control'),
                    schemaTypeMatches(el => _.has(el, 'enum'))
                ), 5)
    ])
    .name;

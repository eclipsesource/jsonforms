import {AbstractControl, Testers, schemaTypeIs, optionIs} from '../abstract-control';

class StringDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-control>
       <input type="text" 
              id="{{vm.id}}" 
              class="form-control jsf-control-string" 
              ng-model="vm.resolvedData[vm.fragment]" 
              ng-change='vm.triggerChangeEvent()' 
              ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = StringController;
    controllerAs = 'vm';
}

class StringAreaDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-control>
       <textarea id="{{vm.id}}" 
                 class="form-control jsf-control-string" 
                 ng-model="vm.resolvedData[vm.fragment]" 
                 ng-change='vm.triggerChangeEvent()' 
                 ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = StringController;
    controllerAs = 'vm';
}

interface StringControllerScope extends ng.IScope { }

class StringController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: StringControllerScope) {
        super(scope);
    }
}

export default angular
    .module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls'])
    .directive('stringControl', () => new StringDirective())
    .directive('textAreaControl', () => new StringAreaDirective())
    .run(['RendererService', RendererService => {
        RendererService.register('string-control', schemaTypeIs('string'), 1);
        RendererService.register('text-area-control',
                Testers.and(
                    schemaTypeIs('string'),
                    optionIs('multi', true)
                ), 2);
    }
    ])
    .name;

import {AbstractControl} from '../abstract-control';
import {schemaTypeIs, Testers, optionIs} from '../../testers';

const stringTemplate = `<jsonforms-control>
  <input type="text"
         id="{{vm.id}}"
         class="form-control jsf-control-string"
         ng-model="vm.resolvedData[vm.fragment]"
         ng-change='vm.triggerChangeEvent()'
         ng-readonly="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

class StringDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'string.html';
    controller = StringController;
    controllerAs = 'vm';
}

const textAreaTemplate = `<jsonforms-control>
  <textarea id="{{vm.id}}"
            class="form-control jsf-control-string"
            ng-model="vm.resolvedData[vm.fragment]"
            ng-change='vm.triggerChangeEvent()'
            ng-readonly="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

class StringAreaDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'text-area.html';
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
    .run(['$templateCache', $templateCache => {
        $templateCache.put('string.html', stringTemplate);
        $templateCache.put('text-area.html', textAreaTemplate);
    }])

    .name;

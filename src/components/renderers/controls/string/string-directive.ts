import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';

class StringDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-control>
       <input type="text" 
              id="{{vm.id}}" 
              class="form-control jsf-control-string" 
              ng-model="vm.modelValue[vm.fragment]" 
              ng-change='vm.modelChanged()' 
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
                 ng-model="vm.modelValue[vm.fragment]" 
                 ng-change='vm.modelChanged()' 
                 ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = StringController;
    controllerAs = 'vm';
}

interface StringControllerScope extends ng.IScope { }

class StringController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: StringControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
}

let StringControlRendererTester: RendererTester = ControlRendererTester('string', 1);
let StringAreaControlRendererTester: RendererTester = function(element: IUISchemaElement,
                                                               dataSchema: any,
                                                               dataObject: any,
                                                               pathResolver: IPathResolver ) {
    let specificity = ControlRendererTester('string', 1)(element,
        dataSchema, dataObject, pathResolver);
    if (specificity === NOT_FITTING) {
        return NOT_FITTING;
    }
    if (element['options'] != null && element['options']['multi']) {
        return 2;
    }
    return NOT_FITTING;
};

export default angular
    .module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls'])
    .directive('stringControl', () => new StringDirective())
    .directive('textAreaControl', () => new StringAreaDirective())
    .run(['RendererService', RendererService => {
            RendererService.register('string-control', StringControlRendererTester);
            RendererService.register('text-area-control', StringAreaControlRendererTester);
        }
    ])
    .name;

import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl} from '../abstract-control';
import {SchemaElement} from '../../../../jsonschema';
import {IUISchemaElement} from '../../../../uischema';

class EnumDirective implements ng.IDirective {
    restrict = 'E';
    template = `<jsonforms-control>
      <select ng-options="option as option for option in vm.options"
              id="{{vm.id}}"
              class="form-control jsf-control-enum" 
              ng-change='vm.modelChanged()'
              ng-model="vm.modelValue[vm.fragment]"
              ng-readonly="vm.uiSchema.readOnly">
      </select>
    </jsonforms-control>`;
    controller = EnumController;
    controllerAs = 'vm';
}

interface EnumControllerScope extends ng.IScope {
}

class EnumController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    private subSchema: SchemaElement;
    constructor(scope: EnumControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
        this.subSchema = this.pathResolver.resolveSchema(this.schema,
            this.uiSchema['scope']['$ref']);
    }

    private get options(){
        return this.subSchema.enum;
    }
}

const EnumControlRendererTester: RendererTester = function(element: IUISchemaElement,
                                                         dataSchema: any,
                                                         dataObject: any,
                                                         pathResolver: IPathResolver ){
    if (element.type !== 'Control') {
        return NOT_FITTING;
    }
    let currentDataSchema = pathResolver.resolveSchema(dataSchema, element['scope']['$ref']);
    if (!_.has(currentDataSchema, 'enum')) {
        return NOT_FITTING;
    }
    return 5;
};

export default angular
    .module('jsonforms.renderers.controls.enum', ['jsonforms.renderers.controls'])
    .directive('enumControl', () => new EnumDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('enum-control', EnumControlRendererTester)
    ])
    .name;

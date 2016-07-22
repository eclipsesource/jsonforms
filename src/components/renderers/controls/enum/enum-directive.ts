import {AbstractControl, Testers, uiTypeIs, schemaTypeMatches} from '../abstract-control';
import {SchemaElement} from '../../../../jsonschema';
import {PathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';

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
    static $inject = ['$scope', 'PathResolver'];
    private subSchema: SchemaElement;
    constructor(scope: EnumControllerScope) {
        super(scope);
        this.subSchema = PathResolver.resolveSchema(this.schema,
            this.uiSchema['scope']['$ref']);
    }

    private get options(){
        return this.subSchema.enum;
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

import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
class EnumDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `<jsonforms-control>
      <select  ng-options="option as option for option in vm.options" id="{{vm.id}}" class="form-control jsf-control jsf-control-enum" ng-change='vm.modelChanged()' ng-model="vm.modelValue[vm.fragment]" ng-readonly="vm.uiSchema.readOnly"></select>
    </jsonforms-control>`;
    controller = EnumController;
    controllerAs = 'vm';
}
interface EnumControllerScopepe extends ng.IScope {
}
class EnumController extends AbstractControl {
    static $inject = ['$scope','PathResolver'];
    private subSchema:SchemaElement;
    constructor(scope:EnumControllerScopepe,refResolver: IPathResolver) {
        super(scope,refResolver);
        this.subSchema = this.pathResolver.resolveSchema(this.schema, this.uiSchema['scope']['$ref']);
    }

    private get options(){
        return this.subSchema.enum;
    }
}
var EnumControlRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='Control')
        return NOT_FITTING;
    let currentDataSchema=pathResolver.resolveSchema(dataSchema,element['scope']['$ref']);
    if(currentDataSchema == undefined || !currentDataSchema.hasOwnProperty('enum'))
        return NOT_FITTING;
    return 5;
}

export default angular
    .module('jsonforms.renderers.controls.enum',['jsonforms.renderers.controls'])
    .directive('enumControl', () => new EnumDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("enum-control",EnumControlRendererTester);
        }
    ])
    .name;

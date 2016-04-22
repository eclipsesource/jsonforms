import "lodash"
import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {PathUtil} from "../../../services/pathutil";
import {AbstractControl, ControlRendererTester} from '../abstract-control';
class ArrayReadOnlyDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-layout class="jsf-group">
      <fieldset>
        <legend>{{vm.label}}</legend>
        <div ng-repeat='d in vm.modelValue[vm.fragment]'>
            <div ng-repeat='prop in vm.properties'>
            <strong>{{prop | capitalize}}:</strong> {{d[prop]}}
            </div>
            <hr ng-show="!$last">
        </div>
       </fieldset>
     </jsonforms-layout>`;
    controller = ArrayController;
    controllerAs = 'vm';
}
class ArrayDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-layout class="jsf-group">
      <fieldset>
        <legend>{{vm.label}}</legend>
        <div ng-repeat="d in vm.modelValue[vm.fragment]">
            <jsonforms schema="vm.arraySchema" data="d"></jsonforms>
        </div>
          <jsonforms schema="vm.arraySchema" data="vm.submitElement"></jsonforms>
       </fieldset>
       <input class="btn btn-primary"
              ng-show="vm.supportsSubmit" type="button" value="Add to {{buttonText}}" ng-click="vm.submitCallback()" ng-model="vm.submitElement">
       </input>
     </jsonforms-layout>`;
    controller = ArrayController;
    controllerAs = 'vm';
}
interface ArrayControllerScope extends ng.IScope {
}
class ArrayController extends AbstractControl {
    private properties:string[];
    private submitElement = {};
    private arraySchema:any;
    static $inject = ['$scope','PathResolver'];
    constructor(scope:ArrayControllerScope,refResolver: IPathResolver) {
        super(scope,refResolver);
        let resolvedSubSchema = this.pathResolver.resolveSchema(this.schema, this.schemaPath) as SchemaArray;
        let items = resolvedSubSchema.items;
        this.arraySchema=items;
        this.properties = _.keys(items['properties']);
    }
    private get supportsSubmit(){
        return !(this.uiSchema['options'] != undefined && this.uiSchema['options']['submit'] == false);
    }
    private get buttonText(){
        return PathUtil.beautifiedLastFragment(this.schemaPath);
    }
    private submitCallback(){
         this.modelValue[this.fragment].push(_.clone(this.submitElement));
    }
}
let ArrayReadOnlyControlRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    let specificity=ControlRendererTester('array',1)(element,dataSchema,dataObject,pathResolver);
    if(specificity==NOT_FITTING)
        return NOT_FITTING;
    if(element['options'] != undefined && element['options']['simple'])
        return 1;
    return NOT_FITTING;
}
let ArrayControlRendererTester: RendererTester = ControlRendererTester('array',1);

export default angular
    .module('jsonforms.renderers.controls.array')
    .directive('arrayReadonlyControl', () => new ArrayReadOnlyDirective())
    .directive('arrayControl', () => new ArrayDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("array-readonly-control",ArrayReadOnlyControlRendererTester);
            RendererService.register("array-control",ArrayControlRendererTester);
        }
    ])
    .name;

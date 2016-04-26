import {RendererTester,RendererService,NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';
class DateTimeDirective implements ng.IDirective {
    restrict = "E";
    //replace= true;
    template = `
    <jsonforms-control>
        <div class="input-group">
          <input type="text" datepicker-popup="dd.MM.yyyy" close-text="Close" is-open="vm.isOpen" id="{{vm.id}}" class="form-control jsf-control-datetime" ng-change='vm.modelChanged()'  ng-model="vm.modelValue[vm.fragment]" ng-readonly="vm.uiSchema.readOnly"/>
             <span class="input-group-btn">
               <button type="button" class="btn btn-default" ng-click="vm.openDate($event)">
                 <i class="glyphicon glyphicon-calendar"></i>
               </button>
             </span>
        </div>
    </jsonforms-control>`;
    controller = DateTimeController;
    controllerAs = 'vm';
}
interface DateTimeControllerScope extends ng.IScope {
}
class DateTimeController extends AbstractControl {
    static $inject = ['$scope','PathResolver'];
    private isOpen:boolean=false;
    constructor(scope: DateTimeControllerScope,refResolver: IPathResolver) {
        super(scope,refResolver);
    }
    private openDate = function($event) {
        this.isOpen = true;
    };
}
var DateTimeControlRendererTester: RendererTester = function (element:IUISchemaElement, dataSchema:any, dataObject:any,pathResolver:IPathResolver ){
    if(element.type!='Control')
        return NOT_FITTING;
    let currentDataSchema=pathResolver.resolveSchema(dataSchema,element['scope']['$ref']);
    if(currentDataSchema !== undefined && currentDataSchema.type == "string" &&
        currentDataSchema['format'] != undefined && currentDataSchema['format'] == "date-time")
        return 5;
    return NOT_FITTING;
}

export default angular
    .module('jsonforms.renderers.controls.datetime',['jsonforms.renderers.controls'])
    .directive('datetimeControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
        {
            RendererService.register("datetime-control",DateTimeControlRendererTester);
        }
    ])
    .name;

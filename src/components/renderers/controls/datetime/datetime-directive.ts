import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl} from '../abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';

class DateTimeDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-control>
        <div class="input-group">
          <input type="text"
                 uib-datepicker-popup="dd.MM.yyyy"
                 close-text="Close"
                 is-open="vm.isOpen"
                 id="{{vm.id}}"
                 class="form-control jsf-control-datetime"
                 ng-change='vm.modelChanged()'
                 ng-model="vm.dt"
                 ng-model-options="{timezone:'UTC'}"
                 ng-readonly="vm.uiSchema.readOnly"/>
             <span class="input-group-btn">
               <button type="button" class="btn btn-default" ng-click="vm.openDate()">
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
    static $inject = ['$scope', 'PathResolver'];
    private isOpen: boolean = false;
    private dt: Date;
    constructor(scope: DateTimeControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
        let value = this.modelValue[this.fragment];
        if (value) {
            this.dt = new Date(value);
        }
        scope.$watch('vm.modelValue[vm.fragment]', (newValue) => {this.updateDateObject(); });
    }
    public openDate() {
        this.isOpen = true;
    }
    protected modelChanged() {
        if (this.dt != null) {
            // returns a string in the form 'yyyy-mm-dd'
            this.modelValue[this.fragment] = this.dt.toISOString().substr(0, 10);
        } else {
            this.modelValue[this.fragment] = null;
        }
        super.modelChanged();
    }
    private updateDateObject() {
        this.dt = new Date(this.modelValue[this.fragment]);
    }
}
const DateTimeControlRendererTester: RendererTester = function(element: IUISchemaElement,
                                                             dataSchema: any,
                                                             dataObject: any,
                                                             pathResolver: IPathResolver) {
    if (element.type !== 'Control') {
        return NOT_FITTING;
    }
    let currentDataSchema = pathResolver.resolveSchema(dataSchema, element['scope']['$ref']);
    if (currentDataSchema !== undefined && currentDataSchema.type === 'string' &&
        currentDataSchema['format'] !== undefined && currentDataSchema['format'] === 'date-time') {
        return 5;
    }
    return NOT_FITTING;
};

export default angular
    .module('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls'])
    .directive('datetimeControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('datetime-control', DateTimeControlRendererTester)
    ])
    .name;

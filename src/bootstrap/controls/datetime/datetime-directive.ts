import {RendererTester, NOT_FITTING} from '../../../components/renderers/renderer-service';
import {IPathResolver} from '../../../components/services/pathresolver/jsonforms-pathresolver';
import {DateTimeController, DateTimeControllerScope} from
    '../../../components/renderers/controls/datetime/datetime-directive';
import {IUISchemaElement} from '../../../uischema';

class DateTimeDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'datetimeBootstrap.html';
    controller = DateTimeBootstrapController;
    controllerAs = 'vm';
}
class DateTimeBootstrapController extends DateTimeController {
    static $inject = ['$scope', 'PathResolver'];
    private isOpen: boolean = false;
    constructor(scope: DateTimeControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
    public openDate() {
        this.isOpen = true;
        if (this.dt == null) {
            this.dt = new Date();
            this.propagateChanges();
        }
    }
    protected updateDateObject() {
        let value = this.modelValue[this.fragment];
        if (value) {
            this.dt = new Date(value);
        } else {
            this.dt = null;
        }
    }
}
const DateTimeControlBootstrapRendererTester: RendererTester = function(element: IUISchemaElement,
                                                             dataSchema: any,
                                                             dataObject: any,
                                                             pathResolver: IPathResolver) {
    if (element.type !== 'Control') {
        return NOT_FITTING;
    }
    let currentDataSchema = pathResolver.resolveSchema(dataSchema, element['scope']['$ref']);
    if (currentDataSchema !== undefined && currentDataSchema.type === 'string' &&
        currentDataSchema['format'] !== undefined && currentDataSchema['format'] === 'date-time') {
        return 10;
    }
    return NOT_FITTING;
};

const datetimeTemplate = `<jsonforms-control>
    <div class="input-group">
      <input type="text"
             uib-datepicker-popup="dd.MM.yyyy"
             close-text="Close"
             is-open="vm.isOpen"
             id="{{vm.id}}"
             class="form-control jsf-control-datetime"
             ng-change='vm.propagateChanges()'
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

export default angular
    .module('jsonforms-bootstrap.renderers.controls.datetime',
        ['jsonforms-bootstrap.renderers.controls'])
    .directive('datetimeBootstrapControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('datetime-bootstrap-control',
                DateTimeControlBootstrapRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetimeBootstrap.html', datetimeTemplate);
    }])
    .name;

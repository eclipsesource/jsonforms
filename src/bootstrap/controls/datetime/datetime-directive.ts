import {IPathResolver} from '../../../components/services/pathresolver/jsonforms-pathresolver';
import {DateTimeController, DateTimeControllerScope} from
    '../../../components/renderers/controls/datetime/datetime-directive';
import {schemaTypeMatches, schemaTypeIs, Testers} from "../../../components/renderers/controls/abstract-control";

class DateTimeDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'datetimeBootstrap.html';
    controller = DateTimeBootstrapController;
    controllerAs = 'vm';
}
class DateTimeBootstrapController extends DateTimeController {
    static $inject = ['$scope', 'PathResolver'];
    private isOpen: boolean = false;
    constructor(scope: DateTimeControllerScope) {
        super(scope);
    }
    public openDate() {
        this.isOpen = true;
        if (this.dt == null) {
            this.dt = new Date();
            this.modelChanged();
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

const datetimeTemplate = `<jsonforms-control>
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

export default angular
    .module('jsonforms-bootstrap.renderers.controls.datetime',
        ['jsonforms-bootstrap.renderers.controls'])
    .directive('datetimeBootstrapControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('datetime-bootstrap-control',
                Testers.and(
                    schemaTypeIs('string'),
                    schemaTypeMatches(el => _.has(el, 'format') && el['format'] === 'date-time')
                ), 10)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetimeBootstrap.html', datetimeTemplate);
    }])
    .name;

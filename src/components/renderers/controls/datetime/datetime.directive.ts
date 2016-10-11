import {AbstractControl} from '../abstract-control';
import {Testers, schemaTypeIs, schemaTypeMatches} from '../../testers';

class DateTimeDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'datetime.html';
    controller = DateTimeController;
    controllerAs = 'vm';
}
export interface DateTimeControllerScope extends ng.IScope {
}
export class DateTimeController extends AbstractControl {
    static $inject = ['$scope'];
    protected dt: Date;
    constructor(scope: DateTimeControllerScope) {
        super(scope);
        let value = this.resolvedData[this.fragment];
        if (value) {
            this.dt = new Date(value);
        }
        scope.$watch('vm.resolvedData[vm.fragment]', (newValue) => {this.updateDateObject(); });
    }
    protected triggerChangeEvent() {
        if (this.dt != null) {
            // returns a string in the form 'yyyy-mm-dd'
            this.resolvedData[this.fragment] = this.dt.toISOString().substr(0, 10);
        } else {
            this.resolvedData[this.fragment] = null;
        }
        super.triggerChangeEvent();
    }
    protected updateDateObject() {
        this.dt = new Date(this.resolvedData[this.fragment]);
    }
}

const datetimeTemplate = `<jsonforms-control>
      <input type="date"
             close-text="Close"
             is-open="vm.isOpen"
             id="{{vm.id}}"
             class="form-control jsf-control-datetime"
             ng-change='vm.triggerChangeEvent()'
             ng-model="vm.dt"
             ng-readonly="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

export default angular
    .module('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls'])
    .directive('datetimeControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('datetime-control',
                Testers.and(
                    schemaTypeIs('string'),
                    schemaTypeMatches(el => _.has(el, 'format') && el['format'] === 'date')
                ), 2)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;

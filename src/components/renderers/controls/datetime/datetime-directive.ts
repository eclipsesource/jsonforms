import {AbstractControl, Testers, schemaTypeMatches, schemaTypeIs} from '../abstract-control';

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
        let value = this.modelValue[this.fragment];
        if (value) {
            this.dt = new Date(value);
        }
        scope.$watch('vm.modelValue[vm.fragment]', (newValue) => {this.updateDateObject(); });
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
    protected updateDateObject() {
        this.dt = new Date(this.modelValue[this.fragment]);
    }
}

const datetimeTemplate = `<jsonforms-control>
      <input type="date"
             close-text="Close"
             is-open="vm.isOpen"
             id="{{vm.id}}"
             class="form-control jsf-control-datetime"
             ng-change='vm.modelChanged()'
             ng-model="vm.dt"
             ng-model-options="{timezone:'UTC'}"
             ng-readonly="vm.uiSchema.readOnly"/>
</jsonforms-control>`;

export default angular
    .module('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls'])
    .directive('datetimeControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('datetime-control',
                Testers.and(
                    schemaTypeIs('string'),
                    schemaTypeMatches(el => _.has(el, 'format') && el['format'] == 'date-time')
                ), 10)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;

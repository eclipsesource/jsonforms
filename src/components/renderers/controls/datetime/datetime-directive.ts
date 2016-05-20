import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl} from '../abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';

class DateTimeDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'datetime.html';
    controller = DateTimeController;
    controllerAs = 'vm';
}
export interface DateTimeControllerScope extends ng.IScope {
}
export class DateTimeController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    private dt: Date;
    constructor(scope: DateTimeControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
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
        }else {
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
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetime.html', require('./datetime.html'));
    }])
    .name;

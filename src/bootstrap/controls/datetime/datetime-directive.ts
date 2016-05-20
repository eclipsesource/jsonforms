import {RendererTester, NOT_FITTING} from '../../../components/renderers/renderer-service';
import {IUISchemaElement} from '../../../jsonforms';
import {IPathResolver} from '../../../components/services/pathresolver/jsonforms-pathresolver';
import {DateTimeController, DateTimeControllerScope} from
    '../../../components/renderers/controls/datetime/datetime-directive';

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
export default angular
    .module('jsonforms-bootstrap.renderers.controls.datetime',
        ['jsonforms-bootstrap.renderers.controls'])
    .directive('datetimeBootstrapControl', () => new DateTimeDirective())
    .run(['RendererService', RendererService =>
            RendererService.register('datetime-bootstrap-control',
                DateTimeControlBootstrapRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('datetimeBootstrap.html', require('./datetimeBootstrap.html'));
    }])
    .name;

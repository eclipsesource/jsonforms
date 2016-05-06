import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl} from '../../controls/abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';
class MasterDetailDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'masterdetail.html';
    controller = MasterDetailController;
    controllerAs = 'vm';
}
interface MasterDetailControllerScope extends ng.IScope {
}
class MasterDetailController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    private subSchema: SchemaElement;
    private selectedChild: any;
    private selectedSchema: SchemaElement;
    constructor(scope: MasterDetailControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
        this.subSchema = this.pathResolver.resolveSchema(this.schema, this.schemaPath);
    }
    public select(selectedChild: any, selectedSchema: SchemaElement) {
        this.selectedChild = selectedChild;
        this.selectedSchema = selectedSchema;
    }
}
const MasterDetailControlRendererTester: RendererTester = function(element: IUISchemaElement,
                                                                   dataSchema: any,
                                                                   dataObject: any,
                                                                   pathResolver: IPathResolver) {
    if (element.type === 'MasterDetailLayout'
        && dataSchema !== undefined
        && dataSchema.type === 'object') {
        return 2;
    }
    return NOT_FITTING;
};

class MasterDetailCollectionDirective implements ng.IDirective {

    restrict = 'E';
    scope = {
        properties: '=',
        instance: '=',
        select: '&'
    };
    templateUrl = 'masterdetail-collection.html';
    link = (scope) => {
        scope.filter = (properties) => {
            let result = {};
            angular.forEach(properties, (value, key) => {
                if (value.type === 'array' && value.items.type === 'object') {
                    result[key] = value;
                }
            });
            return result;
        };
        scope.selectElement = (child, value) => {
            scope.selectedChild = child;
            scope.selectedSchema = value.items;
            scope.select({child: scope.selectedChild, childSchema: scope.selectedSchema});
        };
        scope.hasKeys = (schemaToCheck) =>
            _.keys(scope.filter(schemaToCheck.properties)).length > 0;
        scope.isEmptyInstance = (key) =>
            scope.instance[key] === undefined || scope.instance[key].length === 0;
    };
}

class MasterDetailMember implements angular.IDirective {

    constructor(private $compile: ng.ICompileService) {

    }

    restrict = 'E';
    scope = {
        childSchema: '=',
        childData: '=',
        select: '&',
        filter: '&'
    };
    link = (scope, element) => {
        if (Object.keys(scope.filter(scope.childSchema.properties)).length !== 0) {
            this.$compile(
                `<jsonforms-masterdetail-collection
                            select="select"
                            properties="childSchema.properties"
                            instance="childData">
                </jsonforms-masterdetail-collection>`
            )
            (scope, (cloned) => element.replaceWith(cloned));
        }
    }
}

export default angular
    .module('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts'])
    .directive('masterDetail', () => new MasterDetailDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('master-detail', MasterDetailControlRendererTester)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail.html', require('./masterdetail.html'));
    }])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail-collection.html',
            require('./masterdetail-collection.html'));
    }])
    .directive('jsonformsMasterdetailCollection', () => new MasterDetailCollectionDirective())
    .directive('jsonformsMasterdetailMember', ['$compile', ($compile) =>
        new MasterDetailMember($compile)]
    )
    .name;

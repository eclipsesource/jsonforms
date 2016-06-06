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
        this.scope['select'] = (child, schema) => this.select(child, schema);
        this.subSchema = this.pathResolver.resolveSchema(this.schema, this.schemaPath);
    }
    public select(selectedChild: any, selectedSchema: SchemaElement) {
        this.selectedChild = selectedChild;
        this.selectedSchema = selectedSchema;
        this.scope['selectedChild'] = selectedChild;
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

class MasterDetailCollectionController {
    static $inject = ['$scope'];
    public instance: any;
    public properties: any;
    constructor(private scope) {
        this.scope['filter'] = this.filter;
    }
    public filter(properties) {
        let result = {};
        angular.forEach(properties, (value, key) => {
            if (value.type === 'array' && value.items.type === 'object') {
                result[key] = value;
            }
        });
        return result;
    }
    public get selectedChild() {
        return this.scope.selectedChild;
    }
    public selectElement (child, value) {
        this.scope.select(child, value.items);
    }
    public hasKeys (schemaToCheck) {
        return _.keys(this.filter(schemaToCheck.properties)).length > 0;
    }
    public isEmptyInstance (object, key) {
        return object[key] === undefined || object[key].length === 0;
    }
}
class MasterDetailCollectionDirective implements ng.IDirective {
    restrict = 'E';
    controller = MasterDetailCollectionController;
    controllerAs = 'vm';
    bindToController = {
        properties: '=',
        instance: '='
    };
    scope = true;
    templateUrl = 'masterdetail-collection.html';
}
class MasterDetailMemberController {
    static $inject = ['$compile', '$scope'];
    public childSchema: any;
    public childData: any;
    public element: any;
    constructor(
        private $compile: ng.ICompileService,
        private scope: any
    ) { }
    init() {
        if (_.keys(this.scope.filter(this.childSchema.properties)).length !== 0) {
            this.$compile(
                `<jsonforms-masterdetail-collection
                            properties="vm.childSchema.properties"
                            instance="vm.childData">
                </jsonforms-masterdetail-collection>`
            )
            (this.scope, (cloned) => this.element.replaceWith(cloned));
        }
    }
}


class MasterDetailMember implements angular.IDirective {

    restrict = 'E';
    controller = MasterDetailMemberController;
    controllerAs = 'vm';
    bindToController = {
        childSchema: '=',
        childData: '='
    };
    scope = true;
    link = (scope, el, attrs, ctrl) => {
        ctrl.element = el;
        ctrl.init();
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
    .directive('jsonformsMasterdetailMember', () => new MasterDetailMember())
    .name;

import {AbstractControl} from '../../controls/abstract-control';
import {SchemaElement} from '../../../../jsonschema';
import {uiTypeIs} from '../../testers';

class MasterDetailDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'masterdetail.html';
    controller = MasterDetailController;
    controllerAs = 'vm';
}
interface MasterDetailControllerScope extends ng.IScope {
}
class MasterDetailController extends AbstractControl {
    static $inject = ['$scope'];
    private subSchema: SchemaElement;
    private selectedChild: any;
    private selectedSchema: SchemaElement;
    constructor(scope: MasterDetailControllerScope) {
        super(scope);
        this.scope['select'] = (child, schema) => this.select(child, schema);
        this.subSchema = this.resolvedSchema;
    }
    public select(selectedChild: any, selectedSchema: SchemaElement) {
        this.selectedChild = selectedChild;
        this.selectedSchema = selectedSchema;
        this.scope['selectedChild'] = selectedChild;
    }
}

class MasterDetailCollectionController {
    static $inject = ['$scope'];
    public instance: any;
    public properties: any;
    constructor(private scope) {
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
    public hasContents (child, schemaToCheck) : boolean {
        let keys = _.keys(this.filter(schemaToCheck.properties));
        for (let key of keys){
            if (child[key] !== undefined && child[key].length !== 0) {
                return true;
            }
        }
        return false;
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
        this.$compile(
            `<jsonforms-masterdetail-collection
                        properties="vm.childSchema.properties"
                        instance="vm.childData">
            </jsonforms-masterdetail-collection>`
        )
        (this.scope, (cloned) => this.element.replaceWith(cloned));
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

const masterDetailTemplate = `
<div class="jsf-masterdetail">
    <!-- Master -->
    <div class="jsf-masterdetail-master">
        <jsonforms-masterdetail-collection properties="vm.subSchema.properties"
                                           instance="vm.data">
        </jsonforms-masterdetail-collection>
    </div>
    <!-- Detail -->
    <div class="jsf-masterdetail-detail">
        <jsonforms schema="vm.selectedSchema"
                   data="vm.selectedChild"
                   ng-if="vm.selectedChild"></jsonforms>
    </div>
</div>`;

const masterDetailCollectionTemplate = `
<ul class="jsf-masterdetail-entries" ng-repeat="(key, value) in vm.filter(vm.properties)"
    ng-if="!vm.isEmptyInstance(vm.instance,key)">
    <li ng-repeat="child in vm.instance[key]"
        class="{{vm.isEmptyInstance(vm.instance,key)?'jsf-masterdetail-empty':''}}">
        <div>
            <i
               ng-class="{
                 'chevron-down': vm.object_open[$index],
                 'chevron-right': !vm.object_open[$index]
               }"
               ng-if="vm.hasContents(child,value.items)"
               ng-click="vm.object_open[$index]=!vm.object_open[$index]"></i>
               <i ng-if="!vm.hasContents(child,value.items)" class="chevron-placeholder"></i>
            <span ng-click="vm.selectElement(child,value)"
                  class="jsf-masterdetail-entry"
                  ng-class="{
                    'jsf-masterdetail-entry-selected':vm.selectedChild === child
                  }">
                  {{child.name!=undefined?child.name:child}}
            </span>
        </div>
        <div ng-show="vm.object_open[$index]" ng-if="vm.hasKeys(value.items)" >
            <jsonforms-masterdetail-member child-schema="value.items"
                                           child-data="child">
            </jsonforms-masterdetail-member>
        </div>
    </li>
</ul>`;

export default angular
    .module('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts'])
    .directive('masterDetail', () => new MasterDetailDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('master-detail', uiTypeIs('MasterDetailLayout'), 2)
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail.html', masterDetailTemplate);
    }])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail-collection.html', masterDetailCollectionTemplate);
    }])
    .directive('jsonformsMasterdetailCollection', () => new MasterDetailCollectionDirective())
    .directive('jsonformsMasterdetailMember', () => new MasterDetailMember())
    .name;

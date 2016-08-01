import {AbstractControl} from '../../controls/abstract-control';
import {SchemaElement} from '../../../../jsonschema';
import {PathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {uiTypeIs} from "../../testers";

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
    constructor(scope: MasterDetailControllerScope) {
        super(scope);
        this.scope['select'] = (child, schema) => this.select(child, schema);
        this.subSchema = PathResolver.resolveSchema(this.schema, this.schemaPath);
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
<div>
    <ul class="jsf-masterdetail-properties">
        <li ng-repeat="(key, value) in vm.filter(vm.properties)">
            <div>
                <span class="jsf-masterdetail-property">{{key}}</span>
                <i
                   ng-class="{
                     'chevron-down': vm.attribute_open[$index],
                     'chevron-right': !vm.attribute_open[$index]
                   }"
                   ng-show="!vm.isEmptyInstance(vm.instance,key)" 
                   ng-click="vm.attribute_open[$index]=!vm.attribute_open[$index]">
                </i>
            </div>
            <ul ng-if="!vm.isEmptyInstance(vm.instance,key)" 
                class="jsf-masterdetail-entries" 
                ng-show="vm.attribute_open[$index]">
                <li ng-repeat="child in vm.instance[key]" 
                    class="{{vm.isEmptyInstance(vm.instance,key)?'jsf-masterdetail-empty':''}}">
                    <div>
                        <span ng-click="vm.selectElement(child,value)" 
                              class="jsf-masterdetail-entry" 
                              ng-class="{
                                'jsf-masterdetail-entry-selected':vm.selectedChild === child
                              }">
                              {{child.name!=undefined?child.name:child}}
                        </span>
                        <i
                           ng-class="{
                             'chevron-down': vm.object_open[$index],
                             'chevron-right': !vm.object_open[$index]
                           }"
                           ng-if="vm.hasKeys(value.items)" 
                           ng-click="vm.object_open[$index]=!vm.object_open[$index]"></i>
                    </div>
                    <div ng-show="vm.object_open[$index]" ng-if="vm.hasKeys(value.items)" >
                        <jsonforms-masterdetail-member child-schema="value.items" 
                                                       child-data="child">
                        </jsonforms-masterdetail-member>
                    </div>
                </li>
            </ul>
        </li>
    </ul>
</div>`;

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

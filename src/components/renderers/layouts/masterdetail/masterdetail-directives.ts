import {AbstractControl} from '../../controls/abstract-control';
import {SchemaElement} from '../../../../jsonschema';
import {uiTypeIs} from '../../testers';

class MasterDetailDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'masterdetail.html';
    controller = MasterDetailController;
    controllerAs = 'vm';
}
interface LabelProvider {
    [name: string]: string;
}
interface ImageProvider {
    [name: string]: string;
}
class MasterDetailController extends AbstractControl {
    static $inject = ['$scope'];
    private selectedChild: any;
    private selectedSchema: SchemaElement;
    private labelProvider: LabelProvider;
    private imageProvider: ImageProvider;
    constructor(scope: ng.IScope) {
        super(scope);
        this.scope['select'] = (child, schema) => this.select(child, schema);
        this.labelProvider = this.uiSchema['options']['labelProvider'];
        this.imageProvider = this.uiSchema['options']['imageProvider'];
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
    public schema: any;
    public labelprovider: LabelProvider;
    public imageprovider: ImageProvider;
    constructor(private scope) {
    }
    public getArraySubSchemas(schema) {
        let result = {};
        angular.forEach(schema.properties, (value, key) => {
            if (value.type === 'array' && value.items.type === 'object') {
                result[key] = value;
            }
        });
        return result;
    }
    public get selectedChild() {
        return this.scope.selectedChild;
    }
    public selectElement (child, schema) {
        this.scope.select(child, schema.items);
    }
    public updateHasContents (scope) : void {
        let child = scope.child;
        let schemaToCheck = scope.schema.items;
        let keys = _.keys(this.getArraySubSchemas(schemaToCheck));
        for (let key of keys){
            if (child[key] !== undefined && child[key].length !== 0) {
                scope.hasContents = true;
                return;
            }
        }
        scope.hasContents = false;
    }
    public canHaveChildren(dataSchema): boolean {
        return _.keys(this.getArraySubSchemas(dataSchema.items)).length !== 0;
    }
    public getLabel(data, dataSchema): string {
        let labelProperty = this.labelprovider[dataSchema.items.properties.id];
        if (labelProperty !== undefined) {
            return data[labelProperty];
        }
        return JSON.stringify(data);
    }
    public getImage(dataSchema): string {
        let imageUrl = this.imageprovider[dataSchema.items.properties.id];
        if (imageUrl !== undefined) {
            return imageUrl;
        }
        return null;
    }
    public addElement(data, dataSchema) {
        let possibleKeySchemas = this.getArraySubSchemas(dataSchema.items);
        let possibleAddPoints =  _.keys(possibleKeySchemas);
        let selectedAddPoint =  possibleAddPoints[0];
        if (data[selectedAddPoint] === undefined) {
            data[selectedAddPoint] = [];
        }
        let newElement = {};
        data[selectedAddPoint].push(newElement);
        this.selectElement(newElement, possibleKeySchemas[selectedAddPoint]);
        //TODO cancel angular events
    }
    public removeElement(data, key, parentData) {
        let children : Array<any> = parentData[key];
        let index = children.indexOf(data);
        children.splice(index, 1);
    }
}
class MasterDetailCollectionDirective implements ng.IDirective {
    restrict = 'E';
    controller = MasterDetailCollectionController;
    controllerAs = 'vm';
    bindToController = {
        schema: '=',
        instance: '=',
        labelprovider: '=',
        imageprovider: '='
    };
    scope = true;
    templateUrl = 'masterdetail-collection.html';
}

const masterDetailTemplate = `
<div class="jsf-masterdetail">
    <!-- Master -->
    <div class="jsf-masterdetail-master">
        <jsonforms-masterdetail-collection schema="vm.resolvedSchema" instance="vm.resolvedData"
            labelprovider="vm.labelProvider" imageprovider="vm.imageProvider">
        </jsonforms-masterdetail-collection>
    </div>
    <!-- Detail -->
    <div class="jsf-masterdetail-detail">
        <jsonforms schema="vm.selectedSchema" data="vm.selectedChild" ng-if="vm.selectedChild">
        </jsonforms>
    </div>
</div>`;

const masterDetailCollectionTemplate = `
<script type="text/ng-template" id="masterDetailTreeEntry">
    <div>
        <i ng-class="{
             'chevron-down': object_open && hasContents,
             'chevron-right': !object_open && hasContents,
             'chevron-placeholder': !hasContents
           }"
           ng-click="object_open=!object_open"></i>
        <span class="jsf-masterdetail-entry-icon"><img ng-src="{{vm.getImage(schema)}}"/></span>
        <span ng-click="vm.selectElement(child,schema)"
          class="jsf-masterdetail-entry"
          ng-class="{'jsf-masterdetail-entry-selected':vm.selectedChild === child}">
          {{vm.getLabel(child,schema)}}
          <span class="jsf-masterdetail-entry-add"
            ng-click="vm.addElement(child,schema);vm.updateHasContents($parent);
                $parent.object_open=true;"
            ng-if="vm.canHaveChildren(schema)">+</span>
          <span class="jsf-masterdetail-entry-remove"
            ng-click="vm.removeElement(child,schemaKey,parentItemContext.child);
                vm.updateHasContents(parentItemContext);
                parentItemContext.object_open=
                    parentItemContext.object_open&&parentItemContext.hasContents;
                    vm.selectElement(parentItemContext.child,parentItemContext.schema)"
            ng-if="$parent.$parent.hasContents">-</span>
        </span>
    </div>
    <div ng-show="object_open" ng-if="hasContents" >
        <ul class="jsf-masterdetail-entries"
            ng-repeat="(schemaKey, schema) in vm.getArraySubSchemas(schema.items)">
            <li ng-repeat="child in child[schemaKey]"
                ng-init="vm.updateHasContents(this);
                    parentItemContext = this.$parent.$parent.$parent"
                class="{{!hasContents?'jsf-masterdetail-empty':''}}"
                ng-include="'masterDetailTreeEntry'">
            </li>
        </ul>
    </div>
</script>
<ul class="jsf-masterdetail-entries"
    ng-repeat="(schemaKey, schema) in vm.getArraySubSchemas(vm.schema)">
    <li ng-repeat="child in vm.instance[schemaKey]"
        ng-init="vm.updateHasContents(this);parentItemContext = this.$parent.$parent.$parent"
        class="{{!hasContents?'jsf-masterdetail-empty':''}}"
        ng-include="'masterDetailTreeEntry'">
    </li>
</ul>
`;

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
    .name;

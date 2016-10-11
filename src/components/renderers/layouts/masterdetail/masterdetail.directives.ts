import {PathUtil} from '../../../services/pathutil';
import {AbstractControl} from '../../controls/abstract-control';
import {SchemaElement, SchemaArray} from '../../../../jsonschema';
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
    private labelProvider: LabelProvider = {};
    private imageProvider: ImageProvider = {};
    private treeSchema: SchemaArray;
    private treeData: Array<any>;
    private deletableRoot = true;
    constructor(scope: ng.IScope) {
        super(scope);
        this.scope['select'] = (child, schema) => this.select(child, schema);
        let options = this.uiSchema['options'];
        if (options) {
            let definedLabelProvider = options['labelProvider'];
            if (definedLabelProvider) {
                this.labelProvider = definedLabelProvider;
            }
            let definedImageProvider = options['imageProvider'];
            if (definedImageProvider) {
                this.imageProvider = definedImageProvider;
            }
        }
        if (this.resolvedSchema.type === 'object') {
            let innerSchema = this.resolvedSchema;
            this.treeSchema = { 'type': 'array', 'items': innerSchema };
            this.treeData = [this.resolvedData];
            this.deletableRoot = false;
        } else {
            this.treeSchema = this.resolvedSchema;
            this.treeData = this.resolvedData;
        }
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
    public labelProvider: LabelProvider;
    public imageProvider: ImageProvider;
    public deletableRoot: boolean;
    public selectedSchemaForAdd;
    public selectedElementForAdd;
    public selectedScopeForAdd;
    public showSelectKeyDialog: boolean = false;
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
    public selectElement(child, schema): void {
      if (child === undefined || schema === undefined) {
        this.scope.select(undefined, undefined);
      } else {
        this.scope.select(child, schema.items);
      }
    }
    public updateHasContents(scope): void {
        if (scope.child === this.instance) {
            scope.hasContents = true;
            return;
        }
        let child = scope.child;
        let schemaToCheck = scope.schema.items;
        let keys = _.keys(this.getArraySubSchemas(schemaToCheck));
        scope.hasContents = _.some(keys,
          key => child[key] !== undefined && child[key].length !== 0);
    }
    public canHaveChildren(dataSchema): boolean {
        return _.keys(this.getArraySubSchemas(dataSchema.items)).length !== 0;
    }
    public getLabel(data, dataSchema): string {
        let labelProperty = this.labelProvider[dataSchema.items.id];
        if (labelProperty !== undefined) {
            return data[labelProperty];
        }
        return data.name || data.id || JSON.stringify(data);
    }
    public getImage(dataSchema): string {
        let imageUrl = this.imageProvider[dataSchema.items.id];
        if (imageUrl !== undefined) {
            return imageUrl;
        }
        return null;
    }
    public addElement(schemaKeyForAdd, schemaOfNewElement, event: ng.IAngularEvent): void {
        if (this.selectedElementForAdd[schemaKeyForAdd] === undefined) {
            this.selectedElementForAdd[schemaKeyForAdd] = [];
        }
        let newElement = {};
        this.selectedElementForAdd[schemaKeyForAdd].push(newElement);
        this.selectElement(newElement, schemaOfNewElement);
        event.stopPropagation();
        this.updateHasContents(this.selectedScopeForAdd);
        this.selectedScopeForAdd.object_open = true;
        this.showSelectKeyDialog = false;
        this.selectedScopeForAdd = undefined;
        this.selectedElementForAdd = undefined;
        this.selectedSchemaForAdd = undefined;
    }
    public addToRoot(): void {
      let newElement = {};
      this.instance.push(newElement);
      this.selectElement(newElement, this.schema);
    }
    public removeElement(data, key, parentData, parentSchema): void {
        let children: Array<any>;
        if (parentData === this.instance) {
            children = this.instance;
        } else {
            children = parentData[key];
        }
        let index = children.indexOf(data);
        children.splice(index, 1);
        if (parentData === this.instance) {
          this.selectElement(undefined, undefined);
        } else {
          this.selectElement(parentData, parentSchema);
        }
    }
    public deactivateScroll () {
      (<HTMLElement>document.activeElement).style.overflow = 'hidden';
    }
    public activateScroll () {
      (<HTMLElement>document.activeElement).style.overflow = 'auto';
    }
    public get pageHeight() {
      return document.activeElement['scrollHeight'];
    }
    public get pageWidth() {
      return document.activeElement['scrollWidth'];
    }

    public getBeautifulKeyName(key: string): string {
      return PathUtil.beautify(key);
    }
}
class MasterDetailCollectionDirective implements ng.IDirective {
    restrict = 'E';
    controller = MasterDetailCollectionController;
    controllerAs = 'vm';
    bindToController = {
        schema: '=',
        instance: '=',
        labelProvider: '=',
        imageProvider: '=',
        deletableRoot: '='
    };
    scope = true;
    templateUrl = 'masterdetail-collection.html';
}

const masterDetailTemplate = `
<div class="jsf-masterdetail">
    <!-- Master -->
    <div class="jsf-masterdetail-master">
        <jsonforms-masterdetail-collection schema="vm.treeSchema" instance="vm.treeData"
            label-provider="vm.labelProvider" image-provider="vm.imageProvider"
            deletable-root="vm.deletableRoot">
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
    <span class="jsf-masterdetail-entry-icon" ng-click="vm.selectElement(child,schema)">
      <img ng-src="{{vm.getImage(schema)}}"/>
    </span>
    <span ng-click="vm.selectElement(child,schema)"
      class="jsf-masterdetail-entry"
      ng-class="{'jsf-masterdetail-entry-selected':vm.selectedChild === child}">
      {{vm.getLabel(child,schema)}}
      <span class="jsf-masterdetail-entry-add"
        ng-click="vm.selectedScopeForAdd=$parent;vm.selectedSchemaForAdd=schema;
          vm.selectedElementForAdd=child;vm.showSelectKeyDialog=true;
          vm.addClickPositionX=$event.pageX;vm.addClickPositionY=$event.pageY;vm.deactivateScroll()"
        ng-if="vm.canHaveChildren(schema)">+</span>
      <span class="jsf-masterdetail-entry-remove"
        ng-click="vm.updateHasContents(parentItemContext);
          parentItemContext.object_open=
            parentItemContext.object_open && parentItemContext.hasContents;
            vm.removeElement(child,schemaKey,parentItemContext.child,parentItemContext.schema);"
        ng-if="parentItemContext.hasContents">-</span>
    </span>
  </div>
  <ul class="jsf-masterdetail-entries" ng-show="object_open" ng-if="hasContents"
    ng-repeat="(schemaKey, schema) in vm.getArraySubSchemas(schema.items)">
    <li ng-repeat="child in child[schemaKey]"
      ng-init="vm.updateHasContents(this);object_open=false;
        parentItemContext = this.$parent.$parent.$parent"
      class="{{!hasContents?'jsf-masterdetail-empty':''}}"
      ng-include="'masterDetailTreeEntry'">
    </li>
  </ul>
</script>
<div ng-init="hasContents=vm.deletableRoot;parentItemContext=this;
    child=vm.instance;schema=vm.schema;">
    <span ng-if="vm.deletableRoot" ng-click="vm.addToRoot()"
      class="jsf-masterdetail-addRoot">Add Root Item</span>
    <ul class="jsf-masterdetail-entries" ng-repeat="child in vm.instance"
      ng-init="object_open=false;vm.updateHasContents(this);">
      <li ng-include="'masterDetailTreeEntry'"></li>
    </ul>
</div>
<div class="selectKeyForAdd" ng-if="vm.showSelectKeyDialog"
  ng-click="vm.showSelectKeyDialog=false;vm.activateScroll();"
  ng-style="{'height':vm.pageHeight,'width':vm.pageWidth}">
  <div ng-style="{'left':vm.addClickPositionX,'top':vm.addClickPositionY}">
    <ul>
      <li ng-repeat="(schemaKey, schema) in vm.getArraySubSchemas(vm.selectedSchemaForAdd.items)"
        ng-click="vm.addElement(schemaKey,schema,$event);vm.activateScroll();">
        <span class="jsf-masterdetail-selectkey-icon">
          <img ng-src="{{vm.getImage(schema)}}"/>
        </span>
        <span class="jsf-masterdetail-selectkey-label">{{vm.getBeautifulKeyName(schemaKey)}}</span>
      </li>
    </ul>
    <span ng-click="vm.showSelectKeyDialog=false;vm.activateScroll();">Cancel</span>
  </div>
</div>
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

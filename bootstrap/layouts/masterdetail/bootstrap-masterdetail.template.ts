const masterDetailTemplate = `
<div class="row">
    <!-- Master -->
    <div class="col-sm-30 jsf-masterdetail">
        <jsonforms-masterdetail-collection schema="vm.treeSchema" instance="vm.treeData"
            labelprovider="vm.labelProvider" imageprovider="vm.imageProvider"
            deletableroot="vm.deletableRoot">
        </jsonforms-masterdetail-collection>
    </div>
    <!-- Detail -->
    <div class="col-sm-70">
        <jsonforms schema="vm.selectedSchema"
                   data="vm.selectedChild"
                   ng-if="vm.selectedChild"></jsonforms>
    </div>
</div>`;

const masterDetailCollectionTemplate = `
<script type="text/ng-template" id="masterDetailBootstrapTreeEntry">
  <uib-accordion close-others="false">
    <uib-accordion-group is-open="object_open"
      class="{{!hasContents?'jsf-masterdetail-empty':''}}">
      <uib-accordion-heading class="jsf-masterdetail-header">
        <i
           ng-class="{
             'glyphicon glyphicon-chevron-down': object_open,
             'glyphicon glyphicon-chevron-right': !object_open
           }"
           ng-show="hasContents" >
        </i>
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
              vm.addClickPositionX=$event.pageX;vm.addClickPositionY=$event.pageY"
            ng-if="vm.canHaveChildren(schema)">+</span>
          <span class="jsf-masterdetail-entry-remove"
            ng-click="vm.updateHasContents(parentItemContext);
              parentItemContext.object_open=
                parentItemContext.object_open&&parentItemContext.hasContents;
                vm.removeElement(child,schemaKey,parentItemContext.child,parentItemContext.schema);"
            ng-if="parentItemContext.hasContents">-</span>
        </span>
      </uib-accordion-heading>
      <div class="jsf-masterdetail-entries" ng-show="object_open" ng-if="hasContents"
        ng-repeat="(schemaKey, schema) in vm.getArraySubSchemas(schema.items)">
        <div ng-repeat="child in child[schemaKey]"
          ng-init="vm.updateHasContents(this);object_open=false;
            parentItemContext = this.$parent.$parent.$parent"
          class="{{!hasContents?'jsf-masterdetail-empty':''}}"
          ng-include="'masterDetailBootstrapTreeEntry'">
        </div>
      </div>
  </uib-accordion>
</script>
<div ng-init="hasContents=vm.deletableroot;parentItemContext=this;
    child=vm.instance;schema=vm.schema;">
    <span ng-if="vm.deletableroot" ng-click="vm.addToRoot()"
      class="jsf-masterdetail-addRoot">Add Root Item</span>
    <div class="jsf-masterdetail-entries"
    ng-repeat="child in vm.instance" ng-init="object_open=false;vm.updateHasContents(this);"
    ng-include="'masterDetailBootstrapTreeEntry'">
    </div>
</div>
<div class="selectKeyForAdd" ng-if="vm.showSelectKeyDialog" ng-click="vm.showSelectKeyDialog=false"
  ng-style="{'height':vm.pageHeight,'width':vm.pageWidth}">
  <div ng-style="{'left':vm.addClickPositionX,'top':vm.addClickPositionY}">
    <ul>
      <li ng-repeat="(schemaKey, schema) in vm.getArraySubSchemas(vm.selectedSchemaForAdd.items)"
        ng-click="vm.addElement(schemaKey,schema,$event);">
        <span class="jsf-masterdetail-selectkey-icon">
          <img ng-src="{{vm.getImage(schema)}}"/>
        </span>
        <span class="jsf-masterdetail-selectkey-label">{{vm.getBeautifulKeyName(schemaKey)}}</span>
      </li>
    </ul>
    <span ng-click="vm.showSelectKeyDialog=false">Cancel</span>
  </div>
</div>
`;



export default angular
    .module('jsonforms-bootstrap.renderers.layouts.masterdetail',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail.html', masterDetailTemplate);
    }])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail-collection.html', masterDetailCollectionTemplate);
    }])
    .name;

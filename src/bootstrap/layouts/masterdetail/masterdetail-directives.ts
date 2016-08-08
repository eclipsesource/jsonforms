const masterDetailTemplate = `
<div class="row">
    <!-- Master -->
    <div class="col-sm-30 jsf-masterdetail">
        <jsonforms-masterdetail-collection properties="vm.subSchema.properties"
                                           instance="vm.data">
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
<div>
    <uib-accordion close-others="false">
        <uib-accordion-group is-open="vm.attribute_open[$index]"
                         ng-repeat="(key, value) in vm.filter(vm.properties)"> 
            <uib-accordion-heading class="jsf-masterdetail-header">
                <span class="jsf-masterdetail-property">{{key}}</span>
                <i
                   ng-class="{
                     'glyphicon glyphicon-chevron-down': vm.attribute_open[$index],
                     'glyphicon glyphicon-chevron-right': !vm.attribute_open[$index]
                   }"
                   ng-show="!vm.isEmptyInstance(vm.instance,key)" >
                </i>
            </uib-accordion-heading>

            <uib-accordion close-others="false" 
                           ng-if="!vm.isEmptyInstance(vm.instance,key)" 
                           ng-show="vm.attribute_open[$index]">
                <uib-accordion-group
                    is-open="vm.object_open[$index]"
                    ng-repeat="child in vm.instance[key]"
                    class="{{vm.isEmptyInstance(vm.instance,key)?'jsf-masterdetail-empty':''}}">
                    <uib-accordion-heading>
                        <span ng-click="vm.selectElement(child,value)"
                              class="jsf-masterdetail-entry" 
                              ng-class="{
                                 'jsf-masterdetail-selected':selectedChild==child
                              }">
                              {{child.name!=undefined?child.name:child}}
                        </span>
                        <i
                           ng-class="{
                             'glyphicon glyphicon-chevron-down': vm.object_open[$index],
                             'glyphicon glyphicon-chevron-right': !vm.object_open[$index]
                           }"
                           ng-if="vm.hasKeys(value.items)">
                        </i>
                    </uib-accordion-heading>
                    <div ng-show="vm.object_open[$index]"  
                         ng-if="vm.hasKeys(value.items)" > 
                        <jsonforms-masterdetail-member child-schema="value.items" 
                                                       child-data="child">
                        </jsonforms-masterdetail-member>
                    </div>
                </uib-accordion-group>
            </uib-accordion>
        </uib-accordion-group>
    </uib-accordion>
</div>`;

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

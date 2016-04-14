
// TODO
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

class MasterDetailCollectionDirective implements ng.IDirective {

    constructor() {
        require('./masterdetail.css');
    }

    restrict = "E";
    replace = true;
    scope = {
        properties: '=',
        instance: '=',
        element: '='
    };
    template = `
        <div>
            <accordion close-others="false">
                <accordion-group is-open="status_attribute.open" ng-repeat="(key, value) in element.filter(properties)" ng-class="{'jsf-masterdetail-empty':isEmptyInstance(key)}">
                    <accordion-heading class="jsf-masterdetail-header">
                        <span class="jsf-masterdetail-property">{{key}}</span> <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status_attribute.open, 'glyphicon-chevron-right': !status_attribute.open}" ng-show="!isEmptyInstance(key)"></i>
                    </accordion-heading>

                    <accordion close-others="false" ng-show="!isEmptyInstance(key)">
                        <accordion-group is-open="status_object.open" ng-repeat="child in instance[key]" ng-class="{'jsf-masterdetail-empty':!hasKeys(value.items)}">
                            <accordion-heading>
                                <span ng-click="element.selectedChild=child;element.selectedSchema=value.items;" ng-class="{'jsf-masterdetail-selected':element.selectedChild==child}">{{child.name!=undefined?child.name:child}}<!-- label provider needed --></span>
                                <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status_object.open, 'glyphicon-chevron-right': !status_object.open}" ng-if="hasKeys(value.items)"></i>
                            </accordion-heading>
                            <jsonforms-masterdetail-member element="element" child-schema="value.items" child-data="child"></jsonforms-masterdetail-member>
                        </accordion-group>
                    </accordion>
                </accordion-group>
            </accordion>
        </div>
        `;
    link = (scope, element) => {
        scope.hasKeys=function(schemaToCheck){
            return Object.keys(scope.element.filter(schemaToCheck.properties)).length!=0;
        };
        scope.isEmptyInstance=function(key){
            return scope.instance[key]==undefined || scope.instance[key].length==0;
        }
    };
}

// TODO (?) http://stackoverflow.com/questions/23535994/implementing-angularjs-directives-as-classes-in-typescript
class MasterDetailMember implements ng.IDirective {

    constructor(private $compile:ng.ICompileService) {
        require('./masterdetail.css');
    }

    restrict = "E";
    replace = true;
    scope = {
        childSchema: '=',
        childData: '=',
        element: '=',
    };
    link = (scope, element) => {
        if(Object.keys(scope.element.filter(scope.childSchema.properties)).length!=0){
            this.$compile('<jsonforms-masterdetail-collection properties="childSchema.properties" element="element" instance="childData"></jsonforms-masterdetail-collection>')
            (scope, (cloned) => {
                element.replaceWith(cloned);
            });
        }
    }
}

export default angular
    .module('jsonforms.renderers.layouts.masterdetail')
    .directive('jsonformsMasterdetailCollection', () => new MasterDetailCollectionDirective)
    .directive('jsonformsMasterdetailMember', ($compile) => new MasterDetailMember($compile))
    .name;

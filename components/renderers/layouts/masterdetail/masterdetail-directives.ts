///<reference path="../../../references.ts"/>

class MasterDetailCollectionDirective implements ng.IDirective {
    restrict = "E";
    replace = true;
    scope = {
        collection: '=',
        element: '='
    };
    template = `
        <div>
            <accordion close-others="false">
                <accordion-group is-open="status_attribute.open" ng-repeat="(key, value) in element.filter(collection)">
                    <accordion-heading>
                        {{key}} <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status_attribute.open, 'glyphicon-chevron-right': !status_attribute.open}"></i>
                    </accordion-heading>
                    <accordion close-others="false">
                        <accordion-group is-open="status_object.open" ng-repeat="child in element.instance[key]">
                            <accordion-heading>
                                <span ng-click="element.selectedChild=child;element.selectedSchema=value.items;">{{child.name}}<!-- label provider needed --></span><i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status_object.open, 'glyphicon-chevron-right': !status_object.open}"></i>
                            </accordion-heading>
                            <jsonforms-masterdetail-member element="element" member="value.items"></jsonforms-masterdetail-member>
                        </accordion-group>
                    </accordion>
                </accordion-group>
            </accordion>
        </div>
        `
}

// TODO (?) http://stackoverflow.com/questions/23535994/implementing-angularjs-directives-as-classes-in-typescript
class MasterDetailMember implements ng.IDirective {

    constructor(private $compile:ng.ICompileService) {
    }

    restrict = "E";
    replace = true;
    scope = {
        member: '=',
        element: '='
    };
    link = (scope, element) => {
        this.$compile('<jsonforms-masterdetail-collection collection="member.properties" element="element"></jsonforms-masterdetail-collection>')
        (scope, (cloned) => {
            element.replaceWith(cloned);
        });
    }
}

angular.module('jsonforms.renderers.layouts.masterdetail')
    .directive('jsonformsMasterdetailCollection', () => new MasterDetailCollectionDirective)
    .directive('jsonformsMasterdetailMember', ($compile) => new MasterDetailMember($compile));
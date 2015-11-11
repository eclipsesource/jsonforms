///<reference path="../../../references.ts"/>

angular.module('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts']);
angular.module('jsonforms.renderers.layouts.masterdetail')
.directive('masterdetailCollection', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        scope: {
            collection: '=',
            element:'='
        },
        template:
        `
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
                            <masterdetail-member element="element" member="value.items"></masterdetail-member>
                        </accordion-group>
                    </accordion>
                </accordion-group>
            </accordion>
        </div>
        `
    }
})
.directive('masterdetailMember', function ($compile):ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '=',
            element:'='
        },
        link: function (scope, element, attrs) {
            $compile('<masterdetail-collection collection="member.properties" element="element"></masterdetail-collection>')
            (scope, function(cloned, scope){
                element.replaceWith(cloned);
            });
        }
    }
});

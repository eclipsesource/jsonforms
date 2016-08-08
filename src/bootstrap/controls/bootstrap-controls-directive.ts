const controlTemplate = `<div class="jsf-control form-group top-buffer" ng-class="vm.alerts.length > 0 ? 'has-error' : ''"" ng-hide="vm.hide">
        <label ng-if="vm.showLabel" for="{{vm.id}}">{{vm.label}}</label>
    <div ng-transclude>
    </div>
    <uib-alert ng-repeat="alert in vm.alerts" type="{{alert.type}}" >{{alert.msg}}</uib-alert>
</div>`;

export default angular
    .module('jsonforms-bootstrap.renderers.controls', ['jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;

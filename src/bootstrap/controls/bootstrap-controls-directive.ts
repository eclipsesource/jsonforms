const controlTemplate = `<div class="jsf-control form-group top-buffer" ng-hide="vm.hide">
    <div>
        <label ng-if="vm.showLabel" for="{{vm.id}}">{{vm.label}}</label>
    </div>
    <div ng-transclude>
    </div>
    <div>
        <uib-alert ng-repeat="alert in vm.alerts" type="{{alert.type}}" >{{alert.msg}}</uib-alert>
    </div>
</div>`;

export default angular
    .module('jsonforms-bootstrap.renderers.controls', ['jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;

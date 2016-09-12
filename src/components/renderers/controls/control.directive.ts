const controlTemplate = `<div class="jsf-control form-group" ng-class="vm.alerts.length > 0 ? 'has-error' : ''"" ng-hide="vm.hide">
    <label ng-if="vm.showLabel" for="{{vm.id}}" class="control-label">{{vm.label}}</label>
    <div style="display:flex;" ng-transclude></div>
    <alert ng-repeat="alert in vm.alerts" type="{{alert.type}}" class="jsf-alert">{{alert.msg}}</alert>
</div>`;

class ControlDirective implements ng.IDirective {
    restrict    = 'E';
    transclude  = true;
    templateUrl = 'control.html';
}

export default angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers'])
    .directive('jsonformsControl', () => new ControlDirective)
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;

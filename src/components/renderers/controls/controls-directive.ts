const controlTemplate = `<div class="jsf-control" ng-hide="vm.hide">
    <div>
        <label ng-if="vm.showLabel" for="{{vm.id}}">{{vm.label}}</label>
    </div>
    <div style="display:flex;" ng-transclude>
    </div>
    <div>
        <alert ng-repeat="alert in vm.alerts" type="{{alert.type}}" >{{alert.msg}}</alert>
    </div>
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

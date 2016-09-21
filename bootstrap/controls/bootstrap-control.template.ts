const controlTemplate = `
 <script id="validation.html" type="text/ng-template">
   <div>
     <alert ng-repeat="alert in vm.alerts" type="{{alert.type}}">{{alert.msg}}</alert>
   </div>
 </script>

<div class="jsf-control form-group top-buffer has-feedback" ng-class="vm.alerts.length > 0 ? 'has-error' : ''"" ng-hide="vm.hide">
    <label ng-if="vm.showLabel" for="{{vm.id}}">{{vm.label}}</label>
    <div ng-transclude
         uib-popover-template="'validation.html'"
         popover-enable="vm.alerts.length > 0"
         popover-trigger="mouseenter"
         popover-title="Invalid value"
         popover-placement="bottom-left"
         aria-describedby="inputError2Status"
         ng-class="{'control-error':vm.alerts.length > 0}">
    </div>
     <span ng-if="vm.alerts.length > 0" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
     <span id="inputError2Status" class="sr-only">(error)</span>
</div>`;

export default angular
    .module('jsonforms-bootstrap.renderers.controls', ['jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;

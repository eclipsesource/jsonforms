
const controlTemplate = `<md-input-container flex>
  <label ng-if="vm.showLabel" for="{{vm.id}}">{{vm.label}}</label>
  <ng-transclude></ng-transclude>
  <!--<div ng-messages="{{vm.label}}.$error" role="alert">-->
    <div ng-repeat="errorMessage in vm.alerts">
      <!-- use ng-message-exp for a message whose key is given by an expression -->
      <div >{{errorMessage.msg}}</div>
    </div>
  <!--</div>-->
</md-input-container>`;

export default angular
    .module('jsonforms-material.renderers.controls', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', controlTemplate);
    }])
    .name;


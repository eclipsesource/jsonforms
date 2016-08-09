function customDirective() {
    return {
        restrict : "E",
        template : '<jsonforms-control>' +
          '<input type="text" style="background-color: #3278b3; color: #8dd0ff" class="jsf-control-string jsf-control form-control" ng-change="vm.triggerChangeEvent()" ng-model="vm.resolvedData[vm.fragment]" />' +
        '</jsonforms-control>',
        controller : ['BaseController', '$scope', function(BaseController, $scope) {
            var vm = this;
            BaseController.call(vm, $scope);
        }],
        controllerAs : 'vm'
    };
}

var app = angular.module('makeithappen');
app.directive('customControl', customDirective)
    .run(['RendererService', 'JSONFormsTesters', function(RendererService, testers) {
        RendererService.register("custom-control",
            testers.and(
                testers.uiTypeIs('Control'),
                testers.schemaPropertyName('firstName'),
                testers.optionIs('useCustom', true)
            ), 3);
    }]);

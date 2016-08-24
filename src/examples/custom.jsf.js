function customDirective() {
    return {
        restrict : "E",
        template : '<jsonforms-control><input type="text" style="border-color: #2ecc71" ng-change="vm.triggereChangeEvent()" ng-model="vm.resolvedData[vm.fragment]" /></jsonforms-control>',
        controller:  ['BaseController', '$scope', function(BaseController, $scope) {
            var vm = this;
            BaseController.call(vm, $scope);
        }],
        controllerAs: 'vm'
    }
}

var app = angular.module('jsonforms-website');
app.directive('customControl', customDirective)
app.run(['RendererService', 'JSONFormsTesters', function(RendererService, JSONFormsTesters) {
    RendererService.register(
        "custom-control",
        JSONFormsTesters.and(
            JSONFormsTesters.schemaPathEndsWith("firstName"),
            JSONFormsTesters.uiTypeIs('Control'),
            JSONFormsTesters.optionIs('useCustom', true)
        ),
        100);
}]);

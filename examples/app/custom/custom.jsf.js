function customDirective() {
    return {
        restrict : "E",
        template : '<jsonforms-control>' +
          '<input type="text" style="background-color: #3278b3; color: #8dd0ff" class="jsf-control-string jsf-control form-control" ng-change="vm.modelChanged()" ng-model="vm.modelValue[vm.fragment]" />' +
        '</jsonforms-control>',
        controller : customController,
        controllerAs : 'vm'
    };
}
/**
 * @return {number}
 */
function CustomControlRendererTester (element, dataSchema, dataObject,pathResolver ) {
    if(element.type !== 'Control')
        return -1;
    var schemaPath = element['scope']['$ref'];
    if(schemaPath !== undefined && schemaPath.endsWith("firstName"))
        return 100;
    return -1;
}
var customController = ['$scope','PathResolver', function ($scope,refResolver) {
    var vm = this;
    vm.fragment = refResolver.lastFragment($scope.uischema.scope.$ref);
    vm.modelValue = refResolver.resolveToLastModel($scope.data,$scope.uischema.scope.$ref);
}];

var app = angular.module('makeithappen');
app.directive('customControl', customDirective);
app.run(['RendererService', function(RendererService) {
    RendererService.register("custom-control", CustomControlRendererTester);
}]);

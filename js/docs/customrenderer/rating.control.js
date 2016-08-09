angular.module('jsonforms-website')
    .directive('ratingControl', function() {
        return {
            restrict: 'E',
            controller:  ['BaseController', '$scope', function(BaseController, $scope) {
                var vm = this;
                BaseController.call(vm, $scope);
                vm.max = function() {
                    if (vm.resolvedSchema['maximum'] !== undefined) {
                        return vm.resolvedSchema['maximum'];
                    } else {
                        return 5;
                    }
                };
            }],
            controllerAs: 'vm',
            templateUrl: 'js/docs/customrenderer/rating.control.html'
        };
    })
    .run(['RendererService', 'JSONFormsTesters', function(RendererService, Testers) {
        RendererService.register('rating-control', Testers.and(
            Testers.uiTypeIs('Control'),
            Testers.schemaTypeIs('integer')
        ), 10);
    }]);
'use strict';

var jsonFormsDirectives = angular.module('jsonForms.directives', []);

jsonFormsDirectives.directive('jsonforms',
    ['RenderService', 'BindingService', 'ReferenceResolver',
        function(RenderService, BindingService, ReferenceResolver) {

    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: "=",
            uiSchema: "=",
            data: "=",
            asyncDataProvider: "="
        },
        // TODO: fix template for tests
        templateUrl: 'templates/form.html',
        controller: ['$scope', function($scope) {

            // TODO: call syntax
            var schema = $scope.schema;
            var uiSchema = $scope.uiSchema;
            var dataProvider = $scope.asyncDataProvider;

            schema["uiSchema"] = uiSchema;
            ReferenceResolver.addToMapping(jsonRefs.findRefs(uiSchema));

            if (dataProvider !== undefined) {
                dataProvider.fetchData().$promise.then(function(data) {
                    jsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                        $scope.elements = RenderService.renderAll(schema, resolvedSchema["uiSchema"], data, $scope.asyncDataProvider);
                    });
                });
            } else {
                var data = $scope.data;
                jsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    $scope.elements = RenderService.renderAll(schema, resolvedSchema["uiSchema"], data);
                });
            }


            $scope.bindings = BindingService.all();
            $scope.opened = false;

            $scope.openDate = function($event, element) {
                $event.preventDefault();
                $event.stopPropagation();

                element.isOpen = true;
            };

            $scope.validateNumber = function(value, element) {
                if (value !== undefined && value !== null && isNaN(value)) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid number!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                element.alerts = [];
                return true;
            };

            $scope.validateInteger = function(value, element) {
                if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid integer!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                element.alerts = [];
                return true;
            };
        }]
    };
}]);

jsonFormsDirectives.directive('control', function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            control: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        },
        templateUrl: 'templates/control.html'
    };
});

jsonFormsDirectives.directive('recelement', ['RecursionHelper', function(RecursionHelper) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            element: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        },
        templateUrl: 'templates/element.html',
        compile: function(element){
            return RecursionHelper.compile(element);
        }
    };
}]);



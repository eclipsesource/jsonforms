'use strict';

var jsonFormsDirectives = angular.module('jsonForms.directives', []);

jsonFormsDirectives.directive('jsonforms', ['RenderService', 'BindingService', 'ReferenceResolver', '$q', function(RenderService, BindingService, ReferenceResolver, $q) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: "&",
            uiSchema: "&",
            data: "&"
        },
        // TODO: fix template for tests
        templateUrl: '../templates/form.html',
        controller: ['$scope', function($scope) {

            // TODO: call syntax
            $q.all([$scope.schema()(), $scope.uiSchema()(), $scope.data()()]).then(function(values) {

                var schema = values[0];
                var uiSchema = values[1];
                var data = values[2];
                // let all $refs resolve by adding the UI schema to the regular schema
                schema["uiSchema"] = uiSchema;
                ReferenceResolver.set(jsonRefs.findRefs(uiSchema));

                jsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {

                    $scope.elements = RenderService.renderAll(schema, resolvedSchema["uiSchema"], data);
                    $scope.id = data.id;
                    $scope.bindings = BindingService.all();

                    $scope.opened = false;

                    $scope.openDate = function($event, element) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        element.isOpen = true;
                    };

                    $scope.sendData = function() {
                        var data = {};

                        var bindingsKeys = Object.keys($scope.bindings);

                        for (var i = 0; i < bindingsKeys.length; i++) {
                            var key = bindingsKeys[i];
                            if($scope.bindings[key] != null){
                                data[key] = $scope.bindings[key];
                            }
                        }

                        // TODO: implement submit
                        //SendData.sendData(baseUrl, $routeParams.type, $scope.id, data);
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
                });
            });
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
        templateUrl: '../templates/control.html'
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
        templateUrl: '../templates/element.html',
        compile: function(element){
            return RecursionHelper.compile(element);
        }
    };
}]);



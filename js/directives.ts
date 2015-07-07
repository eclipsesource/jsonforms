/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>

var jsonFormsDirectives = angular.module('jsonForms.directives', ['jsonForms.services']);
//import jsonRefs = require('json-refs')
declare var JsonRefs;

class JsonFormsDiretiveController {

    static $inject = ['RenderService', 'ReferenceResolver', '$scope'];

    constructor(public RenderService:jsonforms.services.IRenderService, public ReferenceResolver:jsonforms.services.IReferenceResolver, public $scope:JsonFormsDirectiveScope) {

        // TODO: call syntax
        var schema = $scope.schema;
        var dataProvider: jsonforms.services.IDataProvider = <jsonforms.services.IDataProvider> $scope.providerName;

        schema["uiSchema"] = $scope.uiSchema;
        ReferenceResolver.addToMapping(JsonRefs.findRefs($scope.uiSchema));
        var that = this;

        // TODO
        if (dataProvider !== undefined) {
            dataProvider.fetchData().$promise.then(function(data) {
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    var ui = resolvedSchema["uiSchema"];
                    $scope['elements'] = [that.RenderService.render(ui, schema, data, "#", dataProvider)];
                });
            });
        } else {
            var data = $scope.data;
            JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                var ui = <jsonforms.services.UISchemaElement> resolvedSchema['uiSchema'];
                $scope['elements'] = [that.RenderService.render(ui, schema, data, "#", null)];
            });
        }


        // TODO
        $scope['opened'] = false;

        $scope['openDate'] = function ($event, element) {
            $event.preventDefault();
            $event.stopPropagation();

            element.isOpen = true;
        };

        $scope['validateNumber'] = function (value, element) {
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

        $scope['validateInteger'] = function (value, element) {
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
    }
}

interface JsonFormsDirectiveScope extends ng.IScope {
    schema: string;
    uiSchema: string;
    data: string;
    providerName: jsonforms.services.IDataProvider
}

class RecElement implements ng.IDirective {

    constructor(private recursionHelper:jsonforms.services.RecursionHelper) {
    }

    restrict = "E";
    replace = true;
    scope = {
        element: '=',
        bindings: '=',
        topOpenDate: '=',
        topValidateNumber: '=',
        topValidateInteger: '='
    };
    templateUrl = 'templates/element.html';

    compile: ng.IDirectiveCompileFn = (element, attr, trans) => {
        return this.recursionHelper.compile(element, trans);
    };

}

jsonFormsDirectives.directive('control', function ():ng.IDirective {

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
}).directive('jsonforms', function ():ng.IDirective {

    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: '=',
            uiSchema: '=',
            data: '=',
            providerName: '='
        },
        // TODO: fix template for tests
        templateUrl: 'templates/form.html',
        controller: JsonFormsDiretiveController
    }
}).directive('recelement', ['RecursionHelper', (recHelper: jsonforms.services.RecursionHelper): ng.IDirective => {
    return new RecElement(recHelper);
}]);

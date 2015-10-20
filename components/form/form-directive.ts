///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="form-controller.ts"/>

var formsModule = angular.module('jsonforms.form');

formsModule.directive('jsonforms', function ():ng.IDirective {

    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: '=',
            uiSchema: '=',
            data: '=',
            asyncSchema: '&',
            asyncUiSchema: '&',
            asyncDataProvider: '='
        },
        // TODO: fix template for tests
        templateUrl: 'form.html',
        controller: FormController
    }
})

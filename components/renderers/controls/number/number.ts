///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="number-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.number', ['jsonforms.renderers.controls']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new NumberRenderer());
}]);
///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="datetime-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new DatetimeRenderer());
}]);
///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="boolean-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.boolean', ['jsonforms.renderers.controls']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new BooleanRenderer());
}]);
